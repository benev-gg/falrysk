
import {RMap} from "@e280/strata"
import {makeId} from "@benev/archimedes"
import {IntentBucket, Port} from "@benev/tact"
import {cycle, guarantee, nap, need} from "@e280/stz"

import {PlayerId} from "../../lib/game/types.js"
import {IntentBucketMap} from "../../lib/game/utils/intent-bucket-map.js"

export class Recruiter {
	#players = new RMap<Port, PlayerId>()
	#ports = new RMap<PlayerId, Port>()

	constructor(private intentBuckets: IntentBucketMap[]) {}

	getPort(playerId: string) {
		return need(this.#ports, playerId)
	}

	listPlayers() {
		return [...this.#players.values()]
	}

	has(playerId: PlayerId) {
		return this.#ports.has(playerId)
	}

	syncWithPorts(ports: Port[]) {
		for (const port of ports) {
			guarantee(this.#players, port, () => {
				const id = makeId()
				this.#ports.set(id, port)
				for (const map of this.intentBuckets)
					map.set(id, new IntentBucket())
				return id
			})
		}

		for (const [port, id] of this.#players.entries()) {
			if (!ports.includes(port)) {
				this.#players.delete(port)
				for (const map of this.intentBuckets)
					map.delete(id)
				this.#ports.delete(id)
			}
		}
	}

	samplingLoop(hz = 120, getNow = () => Date.now()) {
		return cycle(async() => {
			this.#resolveIntents(getNow())
			await nap(1000 / hz)
		})
	}

	#resolveIntents(now: number) {
		for (const [port, playerId] of this.#players) {
			const intents = port.resolveIntents(now)
			for (const map of this.intentBuckets)
				map.get(playerId)?.accumulate(intents)
		}
	}
}

