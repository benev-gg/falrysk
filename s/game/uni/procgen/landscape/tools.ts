
import {clamp} from "@benev/math"
import {LandscapeParams} from "./types.js"
import {makeHasher} from "./utils/hasher.js"
import {Coordinates} from "../../units/coordinates.js"
import {makeNoise} from "../../../../lib/tools/rand.js"

const hasher = makeHasher("ls.tools")

export class LandscapeTools {
	static fn = <P extends any[], R>(fn: (tools: LandscapeTools, ...p: P) => R) => fn

	#size
	#noise

	constructor(params: LandscapeParams) {
		this.#size = params.size
		this.#noise = makeNoise("landscape.noise", params.seed)
	}

	get size() {
		return this.#size
	}

	percent = (p: number) => (p / 100) * this.#size.x

	sample = (w: Coordinates, scale: number, offset = 0) =>
		this.#noise(w.x + offset, w.y + offset, 1 / scale)

	warp = (() => {
		const warpOffset = hasher("ls.tools.warp")

		/** mutates the given coordinates in-place.  */
		return (w: Coordinates, offset: number, scale: number, strength: number) => {
			const x = strength * (this.sample(w, scale, offset) - 0.5)
			const y = strength * (this.sample(w, scale, offset + warpOffset) - 0.5)
			return w.add_(x, y)
		}
	})()
	
	radialGradient = ({x, y}: Coordinates) => {
		const dx = (x / this.size.x) * 2 - 1
		const dy = (y / this.size.y) * 2 - 1
		return 1 - clamp((dx * dx) + (dy * dy))
	}
}

