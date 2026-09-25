
import {Actions} from "@benev/tact"

import {Pod} from "./parts/pod.js"
import {PlayerId} from "./types.js"
import {systems} from "./systems.js"
import {bindings} from "./parts/bindings.js"
import {makeEntities} from "./parts/entitites.js"

export class Simulation {
	readonly entities = makeEntities()
	#pod = new Pod(this.entities)
	#runSystems = systems(this.#pod)

	simulate(actions: Map<PlayerId, Actions<typeof bindings>>) {
		this.#pod.actions = actions
		this.#runSystems()
	}
}

