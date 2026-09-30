
import {clamp, lerp, remap} from "@benev/math"
import {count2d, hash32, pipe} from "@e280/stz"

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

	const getIslandness = (() => {
		const offset1 = hash32("landscape.islandness.offset1")
		const offset2 = hash32("landscape.islandness.offset2")
		const offset3 = hash32("landscape.islandness.offset3")
		const offset4 = hash32("landscape.islandness.offset4")
		return (w: Worldspace2, fatness: number) => {
			const rugged = getRuggedness(w)
			const gradient = radialGradientSq(
				pipe(w)
					.to(w => warp(w, offset1, 500, lerp(rugged, 0, 400)))
					.to(w => warp(w, offset2, 1_500, lerp(rugged, 0, 1100)))
					.to(w => warp(w, offset3, 3_000, percent(6)))
					.to(w => warp(w, offset4, 8_000, percent(12)))
					.done()
			)
			return remap(
				gradient,
				invert(fatness), 1,
				0, 1,
			)
		}
	})()

	function getElevation(w: Worldspace2) {
		const peak = 100
		const island = lerp(getIslandness(w, 0.6), 0, peak)
		return forceSunkenEdge(w, -peak, island)
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

	// console log stats
	{
		const resolution = 1000

		let w = Worldspace2.zero()
		let landCount = 0

		for (let [x, y] of count2d([resolution, resolution])) {
			const elevation = getElevation(
				w.set_(
					(x / resolution) * params.size.x,
					(y / resolution) * params.size.y,
				)
			)

			if (elevation > 0)
				landCount++
		}

		const landFraction = landCount / (resolution * resolution)
		const worldSquareMeters = params.size.x * params.size.y
		const landSquareMeters = landFraction * worldSquareMeters
		const landSquareKm = landSquareMeters / 1_000_000
		const worldSquareKm = worldSquareMeters / 1_000_000
		const oceanSquareKm = worldSquareKm - landSquareKm

		console.log("land square km", landSquareKm.toFixed(1))
		console.log("ocean square km", oceanSquareKm.toFixed(1))
	}

	return {
		getElevation,
		getNormal,
		getSize: () => params.size.dup(),
	}
}

