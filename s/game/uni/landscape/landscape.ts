
import {LandscapeData} from "./types.js"
import {Worldspace2} from "../coords/worldspace.js"
import {makeNoise} from "../../../lib/tools/rand.js"

export class Landscape {
	#data
	#noise

	constructor(data: LandscapeData) {
		this.#data = data
		this.#noise = makeNoise("landscape.noise", data.params.seed)
	}

	getSize() {
		return this.#data.params.size
	}

	getElevation(w: Worldspace2) {
		// TODO:
		return 0
	}

	getHumidity(w: Worldspace2) {
		// TODO:
		return 0
	}

	getSalinity(w: Worldspace2) {
		// TODO:
		return 0
	}
}

