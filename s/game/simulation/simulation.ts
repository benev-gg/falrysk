
import {Actions} from "@benev/tact"
import {applyDelta, Change, Entities} from "@benev/archimedes"

import {Pod} from "./parts/pod.js"
import {PlayerId} from "./types.js"
import {systems} from "./systems.js"
import {bindings} from "./parts/bindings.js"
import {GameComponents} from "./parts/components.js"

export class Simulation {
	change
	#pod
	#runSystems

	constructor() {
		const entities = new Entities<GameComponents>()
		this.change = new Change(delta => applyDelta(entities, delta))
		this.#pod = new Pod(entities.readonly, this.change)
		this.#runSystems = systems(this.#pod)
	}

	simulate(actions: Map<PlayerId, Actions<typeof bindings>>) {
		this.#pod.actions = actions
		this.#runSystems()
	}
}

