
import {tracker} from "@e280/strata"
import {makeId} from "@benev/archimedes"
import {Actions, Port, makeActionsResolver} from "@benev/tact"
import {PlayerId} from "../../../game/simulation/types.js"
import {bindings} from "../../../game/simulation/parts/bindings.js"

type ActionsResolver = ReturnType<typeof makeActionsResolver<typeof bindings>>

export class LocalPlayers {
	#actions = new Map<PlayerId, Actions<typeof bindings>>()
	#details = new Map<PlayerId, {port: Port, resolveActions: ActionsResolver}>()
	#knownPorts = new Set<Port>()

	get actions() {
		tracker.read(this)
		return this.#actions
	}

	getIds(): PlayerId[] {
		return [...this.#actions.keys()]
	}

	update(now: number, ports: Port[]) {

		// delete stale players
		for (const [id, {port}] of this.#details) {
			if (!ports.includes(port))
				this.#delete(id)
		}

		// create fresh players
		for (const port of ports) {
			if (!this.#knownPorts.has(port))
				this.#create(port)
		}

		// resolve actions for all players
		for (const [id, details] of this.#details) {
			const intents = details.port.resolveIntents(now)
			const actions = details.resolveActions(intents)
			this.#actions.set(id, actions)
		}

		return this.#actions
	}

	#create(port: Port) {
		const id = makeId()
		const resolveActions = makeActionsResolver(bindings)
		const actions = resolveActions([])
		this.#actions.set(id, actions)
		this.#details.set(id, {port, resolveActions})
		this.#knownPorts.add(port)
		tracker.write(this)
		return id
	}

	#delete(id: PlayerId) {
		const details = this.#details.get(id)
		if (details) {
			this.#actions.delete(id)
			this.#details.delete(id)
			this.#knownPorts.delete(details.port)
			tracker.write(this)
		}
	}
}

