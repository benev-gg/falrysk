
import {disposer} from "@e280/stz"
import {gameloop} from "@benev/archimedes"
import {effect, RMap, signal} from "@e280/strata"

import {Basis} from "../../types.js"
import {consts} from "../../../consts.js"
import {Director, Seat} from "./types.js"
import {LocalPlayers} from "../inputs/local-players.js"
import {PlayerId} from "../../../game/simulation/types.js"
import {syncFreshSeats} from "./utils/sync-fresh-seats.js"
import {syncStaleSeats} from "./utils/sync-stale-seats.js"
import {Simulation} from "../../../game/simulation/simulation.js"
import {allProjectorsReady} from "./utils/all-projectors-ready.js"

export async function makeDirector(basis: Basis): Promise<Director> {
	const dispose = disposer()
	const seats = new RMap<PlayerId, Seat>()
	const simulation = new Simulation()
	const entities = simulation.entities.readonly
	const players = new LocalPlayers()
	const $playing = signal(false)

	// start running the simulation
	dispose.schedule(
		gameloop(consts.simulationHz, async() => {
			players.update(performance.now(), basis.deck.ports)

			if ($playing())
				simulation.simulate(players.actions)
		}),
	)

	// ensure one projection per player
	dispose.schedule(
		effect(() => {
			syncFreshSeats(players, seats, entities)
			syncStaleSeats(players, seats)
		})
	)

	// dispose all projections when director is cleaned up
	dispose.schedule(
		() => [...seats.values()].map(seat => seat.dispose())
	)

	try {
		players.update(performance.now(), basis.deck.ports)
		await allProjectorsReady(seats)
		return {simulation, seats, $playing, dispose}
	}
	catch (error) {
		dispose()
		throw error
	}
}

