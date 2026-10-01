
import {hash32, pipe} from "@e280/stz"
import {clamp, lerp, average, invert, smootherstep, linear, remap} from "@benev/math"

import {LandscapeParams} from "./types.js"
import {makeNoise, makeRand} from "../../../../lib/tools/rand.js"
import {Worldspace2, Worldspace3} from "../../coords/worldspace.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const timeStart = performance.now()

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
		const linearPoints = [0, 1, 1, 0]

		return (w: Worldspace2, gradient: number, shoreline: number) => {
			const offshore = remap(gradient, shoreline / 2, shoreline, 1, 0)
			const chance = linear(offshore, linearPoints)
			if (chance <= 0) return -1

			const islets = (
				chance *
				sample(w, percent(10), offset1) *
				sample(w, percent(40), offset2)
			)

			return remap(islets, 0.5, 1)
		}
	})()

	const getRidges = (() => {
		const ridgeline1 = hash32("landscape.ridges.ridgeline1")
		const ridgeline2 = hash32("landscape.ridges.ridgeline2")

		const warp1 = hash32("landscape.ridges.warp1")
		const warp2 = hash32("landscape.ridges.warp2")

		const offset1 = hash32("landscape.ridges.offset1")
		const warbleSeed = hash32("landscape.ridges.warble")
		const regionsOffset1 = hash32("landscape.ridges.regions1")

		const seed1 = hash32("landscape.ridges.seed1")
		const seed2 = hash32("landscape.ridges.seed2")
		const seed3 = hash32("landscape.ridges.seed3")

		const damageOffset = hash32("landscape.ridges.damage")
		const jaggedOffset = hash32("landscape.ridges.jagged")

		const subridges = (w: Worldspace2, scale: number, seed: number) => {
			const w1 = warp(w, seed + warp1, 10_000, 10_000)
			const n = sample(w1, scale, seed + offset1)
			return 1 - Math.abs(n * 2 - 1)
		}

		const getRegions = (w: Worldspace2, scale: number, seed: number) => {
			return sample(w, scale, seed) ** 2
		}

		const applyDamage = (w: Worldspace2, mass: number, intensity: number) => {
			const damage = sample(w, 2_500, damageOffset)
			return mass * (1 - damage * intensity)
		}

		return (w: Worldspace2, landmassGradient: number, peak: number) => {
			const warble = getRegions(w, 10_000, warbleSeed)

			const w1 = pipe(w)
				.to(w => warp(w, warp1 + seed1, 500, lerp(warble, 0, 100)))
				.to(w => warp(w, warp1 + seed2, 3000, lerp(warble, 0, 500)))
				.to(w => warp(w, warp1 + seed3, 10_000, 3_000))
				.done()

			const w2 = pipe(w)
				.to(w => warp(w, warp2 + seed1, 500, lerp(warble, 0, 100)))
				.to(w => warp(w, warp2 + seed2, 3000, lerp(warble, 0, 500)))
				.to(w => warp(w, warp2 + seed3, 10_000, 10_000))
				.done()

			const r1 = clamp(subridges(w1, 12000, ridgeline1))
			const r2 = clamp(subridges(w2, 8000, ridgeline2)) / 2

			const regions = getRegions(w, 15_000, regionsOffset1)
			const jagged = warble * sample(w, 250, jaggedOffset) * 0.02

			const mass = Math.max(0, average(r1, r2) * 2)
			const damaged = applyDamage(w, mass + jagged, 0.5)

			return peak * regions * landmassGradient * damaged
		}
	})()

	function getElevation(w: Worldspace2) {
		const peak = 500
		const isletsPeak = 50
		const shoreline = 0.4
		const outsideTheGradient = radialGradientSq(w) <= 0

		if (outsideTheGradient)
			return -peak

		const islandGradient = getIslandGradient(w)
		const islandCore = remap(islandGradient, shoreline, 1)
		const island = lerp(islandCore, 0, peak)

		const landmassGradient = remap(islandGradient, shoreline, 1)
		const ridges = getRidges(w, landmassGradient, 2000)

		const isletsGradient = getIsletsGradient(w, islandGradient, shoreline)
		const islets = isletsGradient * (
			isletsGradient > -0.05
				? isletsPeak
				: peak
		)

		const final = Math.max(island + ridges, islets)
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

	console.log(`makeLandscape ${(performance.now() - timeStart).toFixed(1)}ms`)

	return {
		getElevation,
		getNormal,
		getSize: () => params.size.dup(),
	}
}

