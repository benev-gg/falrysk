
import {Rand, seed} from "@e280/stz"
import {makeNoiseSampler} from "@benev/math"
import {Worldspace2, Worldspace3} from "../coords/worldspace.js"

export class Oracle {
	rand
	#noise

	constructor(public options: {
			seed: number
			size: Worldspace2
		}) {
		this.rand = new Rand(seed(options.seed))
		this.#noise = makeNoiseSampler(this.rand.random)
	}

	elevation(w: Worldspace2) {
		return this.#noise(w.x, w.y)
	}

	normal(p: Worldspace2) {
		const d = 1

		const dx =
			this.elevation(new Worldspace2(p.x + d, p.y)) -
			this.elevation(new Worldspace2(p.x - d, p.y))

		const dy =
			this.elevation(new Worldspace2(p.x, p.y + d)) -
			this.elevation(new Worldspace2(p.x, p.y - d))

		return new Worldspace3(-dx, -dy, 2 * d).normalize()
	}

	moisture(w: Worldspace2) {
		// TODO
		return this.#noise(w.x, w.y)
	}

	rockiness(w: Worldspace2) {
		// TODO
		return this.#noise(w.x, w.y)
	}

	forestness(w: Worldspace2) {
		// TODO
		return this.#noise(w.x, w.y)
	}

	fertility(w: Worldspace2) {
		// TODO
		return this.#noise(w.x, w.y)
	}
}

