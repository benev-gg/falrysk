
import {count2d, hash32, pipe, Pipe} from "@e280/stz"
import {clamp, lerp, remap} from "@benev/math"
import {LandscapeParams} from "./types.js"
import {makeNoise, makeRand} from "../../../../lib/tools/rand.js"
import {Worldspace2, Worldspace3} from "../../coords/worldspace.js"

export type Landscape = ReturnType<typeof makeLandscape>

function invert(x: number) {
	return 1 - x
}

function smoothstep(x: number) {
	return x * x * (3 - (2 * x))
}

function smootherstep(x: number) {
	return x * x * x * (x * (x * 6 - 15) + 10)
}

export function makeLandscape(params: LandscapeParams) {
	const rand = makeRand("landscape.rand", params.seed)
	const noise = makeNoise("landscape.noise", params.seed)
	const center = params.size.dup().half()
	const h1 = hash32("h1")
	const h2 = hash32("h2")
	const h3 = hash32("h3")

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

	const warp = (w: Worldspace2, scale: number, strength: number) => {
		const x = strength * sample(w, scale, 12345)
		const y = strength * sample(w, scale, 67890)
		return w.dup().add_(x, y)
	}

	function getElevation(w: Worldspace2) {
		const gradient = radialGradientSq(
			pipe(w)
				.to(w => warp(w, 8_000, percent(12)))
				.to(w => warp(w, 3_000, percent(6)))
				.done()
		)
		const island = gradient > 0.7 ? 10 : -10
		return forceSunkenEdge(w, -10, island)
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

