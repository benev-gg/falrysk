
import {hash32, pipe} from "@e280/stz"
import {clamp, lerp, remap, spline} from "@benev/math"

import {LandscapeParams} from "./types.js"
import {makeNoise, makeRand} from "../../../../lib/tools/rand.js"
import {invert, smootherstep} from "../../../../lib/tools/math.js"
import {Worldspace2, Worldspace3} from "../../coords/worldspace.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const rand = makeRand("landscape.rand", params.seed)
	const noise = makeNoise("landscape.noise", params.seed)
	const center = params.size.dup().half()

	const percent = (p: number) => (p / 100) * params.size.x

	const radialGradientSq = (w: Worldspace2) => {
		const radiusSq = Math.min(center.x, center.y) ** 2
		const distanceSq = w.distanceSquared(center)
		return invert(clamp(distanceSq / radiusSq))
	}

	const edge = (gradient: number) =>
		smootherstep(remap(gradient, 0, 0.05, 1, 0, true))

	const forceSunkenEdge = (w: Worldspace2, low: number, elevation: number) =>
		lerp(edge(radialGradientSq(w)), elevation, low)

	const sample = (w: Worldspace2, scale: number, offset = 0) =>
		noise(w.x + offset, w.y + offset, 1 / scale)

	const warp = (() => {
		const secondaryOffset = hash32("landscape.warp.secondaryOffset")
		return (w: Worldspace2, offset: number, scale: number, strength: number) => {
			const x = strength * (sample(w, scale, offset) - 0.5)
			const y = strength * (sample(w, scale, offset + secondaryOffset) - 0.5)
			return w.dup().add_(x, y)
		}
	})()

	const getRuggedness = (() => {
		const s = hash32("landscape.ruggedness")
		return (w: Worldspace2) => clamp(sample(w, 10_000, s) ** 2)
	})()

	const getIslandGradient = (() => {
		const offset1 = hash32("landscape.islandness.offset1")
		const offset2 = hash32("landscape.islandness.offset2")
		const offset3 = hash32("landscape.islandness.offset3")
		const offset4 = hash32("landscape.islandness.offset4")
		return (w: Worldspace2) => {
			const rugged = getRuggedness(w)
			return radialGradientSq(
				pipe(w)
					.to(w => warp(w, offset1, 500, lerp(rugged, 0, percent(1))))
					.to(w => warp(w, offset2, 1_500, lerp(rugged, 0, percent(3))))
					.to(w => warp(w, offset3, 3_000, percent(6)))
					.to(w => warp(w, offset4, 8_000, percent(12)))
					.done()
			)
		}
	})()

	const getIsletsGradient = (() => {
		const offset1 = hash32("landscape.islets.offset1")
		const offset2 = hash32("landscape.islets.offset2")
		return (w: Worldspace2, gradient: number, shoreline: number) => {
			const offshore = remap(gradient, shoreline / 2, shoreline, 1, 0)
			const chance = spline.ezLinear(offshore, [0, 1, 1, 0])
			const islets = (
				chance *
				sample(w, percent(10), offset1) *
				sample(w, percent(40), offset2)
			)
			return remap(islets, 0.5, 1)
		}
	})()

	function getElevation(w: Worldspace2) {
		const peak = 500
		const isletsPeak = 50
		const shoreline = 0.4

		const gradient = getIslandGradient(w)
		const islandCore = remap(gradient, shoreline, 1)
		const island = lerp(islandCore, 0, peak)

		const isletsGradient = getIsletsGradient(w, gradient, shoreline)
		const islets = isletsGradient * (
			isletsGradient > -0.05
				? isletsPeak
				: peak
		)

		const final = Math.max(island, islets)
		return forceSunkenEdge(w, -peak, final)
	}

	function getNormal(w: Worldspace2) {
		const d = 1
		const dx =
			getElevation(new Worldspace2(w.x + d, w.y)) -
			getElevation(new Worldspace2(w.x - d, w.y))
		const dy =
			getElevation(new Worldspace2(w.x, w.y + d)) -
			getElevation(new Worldspace2(w.x, w.y - d))
		return new Worldspace3(-dx, -dy, 2 * d).normalize()
	}

	return {
		getElevation,
		getNormal,
		getSize: () => params.size.dup(),
	}
}

