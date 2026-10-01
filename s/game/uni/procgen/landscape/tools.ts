
import {hash32} from "@e280/stz"
import {LandscapeParams} from "./types.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeNoise, makeRand} from "../../../../lib/tools/rand.js"

export class LandscapeTools {
	#params
	#rand
	#noise

	constructor(params: LandscapeParams) {
		this.#params = params
		this.#rand = makeRand("landscape.rand", params.seed)
		this.#noise = makeNoise("landscape.noise", params.seed)
	}

	get size() {
		return this.#params.size
	}

	percent = (p: number) => (p / 100) * this.#params.size.x

	sample = (w: Worldspace2, scale: number, offset = 0) =>
		this.#noise(w.x + offset, w.y + offset, 1 / scale)

	warp = (() => {
		const secondaryOffset = hash32("landscape.warp.secondaryOffset")
		return (w: Worldspace2, offset: number, scale: number, strength: number) => {
			const x = strength * (this.sample(w, scale, offset) - 0.5)
			const y = strength * (this.sample(w, scale, offset + secondaryOffset) - 0.5)
			return w.dup().add_(x, y)
		}
	})()
}

