
import {hash32} from "@e280/stz"
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

	const radialGradient = (w: Worldspace2) => {
		const radius = Math.min(center.x, center.y)
		const distance = w.distance(center)
		return smootherstep(invert(clamp(distance / radius)))
	}

	const edge = (gradient: number) =>
		smootherstep(remap(gradient, 0, 0.1, 1, 0, true))

	const forceSunkenEdge = (gradient: number, low: number, elevation: number) =>
		lerp(edge(gradient), elevation, low)

	const sample = (w: Worldspace2, scale: number, offset = 0) =>
		noise(w.x + offset, w.y + offset, 1 / scale)

	const warp = (w: Worldspace2, scale: number, strength: number) => {
		const x = strength * sample(w, scale, 12345)
		const y = strength * sample(w, scale, 67890)
		return w.dup().add_(x, y)
	}

	function getElevation(w: Worldspace2) {
		const gradient = radialGradient(w)
		const seafloor = -300
		const reef = -10
		const shoreline = remap(
			gradient * sample(w, 5_000, h1),
			0.1, 1,
			0, 1,
			true,
		)
		const innerIsland = remap(
			gradient * sample(w, 5_000, h2),
			0.2, 1,
			0, 1,
			true,
		)
		const result = (
			lerp(shoreline, reef, 300) +
			lerp(smootherstep(innerIsland), 0, 500)
		)
		return forceSunkenEdge(gradient, seafloor, result)
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

