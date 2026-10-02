
import {hash32} from "@e280/stz"
import {clamp} from "@benev/math"
import {LandscapeParams} from "./types.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeNoise} from "../../../../lib/tools/rand.js"

export class LandscapeTools {
	static fn = <P extends any[], R>(fn: (tools: LandscapeTools, ...p: P) => R) => fn

	#params
	#noise

	constructor(params: LandscapeParams) {
		this.#params = params
		this.#noise = makeNoise("landscape.noise", params.seed)
	}

	get size() {
		return this.#params.size
	}

	percent = (p: number) => (p / 100) * this.#params.size.x

	sample = (w: Worldspace2, scale: number, offset = 0) =>
		this.#noise(w.x + offset, w.y + offset, 1 / scale)

	warp = (() => {
		const warpOffset = hash32("landscape.warp")

		/** mutates the given coordinates in-place.  */
		return (w: Worldspace2, offset: number, scale: number, strength: number) => {
			const x = strength * (this.sample(w, scale, offset) - 0.5)
			const y = strength * (this.sample(w, scale, offset + warpOffset) - 0.5)
			return w.add_(x, y)
		}
	})()
	
	radialGradient = ({x, y}: Worldspace2) => {
		const dx = (x / this.size.x) * 2 - 1
		const dy = (y / this.size.y) * 2 - 1
		return 1 - clamp((dx * dx) + (dy * dy))
	}
}

