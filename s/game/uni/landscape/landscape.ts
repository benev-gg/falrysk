
import {makeBedrock} from "./data.js"
import {surveyResolution} from "./consts.js"
import {LandscapeData, SampleFn} from "./types.js"
import {Worldspace2, Worldspace3} from "../coords/worldspace.js"

export class Landscape {
	#data
	#elevation: SampleFn

	constructor(data: LandscapeData) {
		this.#data = data
		this.#elevation = makeBedrock(data.params)
	}

	getSize() {
		return this.#data.params.size
	}

	getElevation(w: Worldspace2) {
		return this.#elevation(w)
	}

	getNormal(w: Worldspace2) {
		const d = 1

		const dx =
			this.getElevation(
				new Worldspace2(w.x + d, w.y),
			) -
			this.getElevation(
				new Worldspace2(w.x - d, w.y),
			)

		const dy =
			this.getElevation(
				new Worldspace2(w.x, w.y + d),
			) -
			this.getElevation(
				new Worldspace2(w.x, w.y - d),
			)

		return new Worldspace3(
			-dx,
			-dy,
			2 * d,
		).normalize()
	}

	getFlow(w: Worldspace2) {
		return this.#data
			.surveys
			.flow[this.#surveyIndex(w)]
	}

	getBasin(w: Worldspace2) {
		return this.#data
			.surveys
			.basins[this.#surveyIndex(w)]
	}

	getHumidity(w: Worldspace2) {
		return (
			this.#data
				.surveys
				.humidity[this.#surveyIndex(w)]
			/ 255
		)
	}

	getDrainage(w: Worldspace2) {
		return this.#data
			.surveys
			.drainage[this.#surveyIndex(w)]
	}

	getSalinity(w: Worldspace2) {
		// temporary:
		// until water bodies are explicitly surveyed,
		// everything beneath sea level is ocean.
		return this.getElevation(w) <= 0
			? 1
			: 0
	}

	#surveyIndex(w: Worldspace2) {
		const size = this.getSize()

		const x = Math.round(
			Math.max(0, Math.min(1, w.x / size.x))
			* (surveyResolution - 1),
		)

		const y = Math.round(
			Math.max(0, Math.min(1, w.y / size.y))
			* (surveyResolution - 1),
		)

		return (
			y * surveyResolution +
			x
		)
	}
}

