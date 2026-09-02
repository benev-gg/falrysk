
import {got} from "@e280/stz"
import {compose, Mat4} from "@benev/math"
import {createHierarchyInstancePool, HierarchyInstancePool, setHierarchyInstanceCount, setHierarchyInstanceMatrix} from "@babylonjs/lite"

import {Prop} from "./types.js"
import {Art} from "./art/art.js"
import {AssetDepot} from "./depot.js"
import {Artwork} from "./art/types.js"
import {Figures} from "./art/figures.js"

export class Replicator {
	#state = new Map<Art, {prop: Prop, pool: HierarchyInstancePool}>()
	#matrix = new Mat4().array()

	constructor(
			public readonly artwork: Artwork,
			public readonly depot: AssetDepot,
			public readonly figures: Figures,
		) {

		for (const art of Art.collect(artwork)) {
			const prop = depot.prop(art.name)
			const pool = createHierarchyInstancePool(prop, art.population)
			this.#state.set(art, {prop, pool})
		}
	}

	update() {
		for (const [art, figset] of this.figures.entries()) {
			const {pool} = got(this.#state.get(art))

			const visible = [...figset]
				.filter(figure => figure.visible)
				.slice(0, art.population)

			if (visible.length !== pool.count)
				setHierarchyInstanceCount(pool, visible.length)

			for (let index = 0; index < visible.length; index++) {
				const figure = visible[index]
				const {position, rotation, scale} = figure
				compose(this.#matrix, position, rotation, scale)
				setHierarchyInstanceMatrix(pool, index, this.#matrix)
			}
		}
	}
}

