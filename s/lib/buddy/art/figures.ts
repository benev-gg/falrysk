
import {guarantee} from "@e280/stz"
import {Art} from "./art.js"
import {Figure} from "./figure.js"

/** describes the art figure instances that should be in a scene */
export class Figures {
	#map = new Map<Art, Set<Figure>>()

	/** create a new figure instance for this art */
	create(art: Art) {
		const set = guarantee(this.#map, art, () => new Set())
		const figure = new Figure(() => set.delete(figure))
		set.add(figure)
		return figure
	}

	/** iterate over each piece of art, and its set of figure instances */
	entries() {
		return this.#map.entries()
	}
}

