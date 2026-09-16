
import {Actions} from "@benev/tact"
import {disposer, got} from "@e280/stz"
import {renderFrame} from "@babylonjs/lite"
import {EntitiesReadonly} from "@benev/archimedes"
import {effect, RMap, wait, Waiter} from "@e280/strata"

import {Basis} from "../types.js"
import {consts} from "../../consts.js"
import {Realm} from "../../game/renderer/realm.js"
import {LocalPlayers} from "./inputs/local-players.js"
import {setupVenue} from "../../game/renderer/venue.js"
import {setupScene} from "../../game/renderer/scene.js"
import {PlayerId} from "../../game/simulation/types.js"
import {setupRender} from "../../game/renderer/render.js"
import {smartCycle} from "../../lib/tools/smart-cycle.js"
import {Simulation} from "../../game/simulation/simulation.js"
import {bindings} from "../../game/simulation/parts/bindings.js"
import {GameComponents} from "../../game/simulation/parts/components.js"

export type Projection = {
	realm: Realm
	playerId: PlayerId
	render: (dt: number) => void
	getActions: () => Actions<typeof bindings>
	dispose: () => void
}

export type Projections = RMap<PlayerId, Waiter<Projection>>
export type Director = Awaited<ReturnType<typeof startDirector>>

export async function startDirector(basis: Basis) {
	const dispose = disposer()
	const projections: Projections = new RMap()

	const simulation = new Simulation()
	const entities = simulation.entities.readonly
	const players = new LocalPlayers()

	// start running the simulation
	dispose.schedule(
		smartCycle(consts.simulationHz.max, 3, async() => {
			players.update(performance.now(), basis.deck.ports)
			simulation.simulate(players.actions)
		})
	)

	// ensure one projection per player
	dispose.schedule(
		effect(() => {
			syncFreshProjections(players, projections, entities)
			syncStaleProjections(players, projections)
		})
	)

	// dispose all projections when director is cleaned up
	dispose.schedule(
		() => [...projections.values()].map(dumpProjection)
	)

	// wait for all active projections to ready up
	await projectionsReady(projections)

	return {simulation, projections, dispose}
}

const syncFreshProjections = (
		players: LocalPlayers,
		projections: Projections,
		entities: EntitiesReadonly<GameComponents>,
	) => {
	for (const playerId of players.actions.keys()) {
		if (!projections.has(playerId))
			projections.set(playerId, createProjection(playerId, players, entities))
	}
}

const syncStaleProjections = (
		players: LocalPlayers,
		projections: Projections,
	) => {
	for (const [playerId, waiting] of projections) {
		if (!players.actions.has(playerId)) {
			dumpProjection(waiting)
			projections.delete(playerId)
		}
	}
}

const dumpProjection = (waiting: Waiter<Projection>) => {
	waiting.result.then(result => result.ok && result.value.dispose())
}

const createProjection = (
		playerId: PlayerId,
		players: LocalPlayers,
		entities: EntitiesReadonly<GameComponents>,
	) => wait(async() => {

	const venue = await setupVenue({playerId, entities})

	try {
		const getActions = () => got(players.actions.get(playerId))
		const realm = new Realm(venue)
		const runRenderSystems = setupRender(realm)

		await setupScene(realm)

		const render = (dt: number) => {
			runRenderSystems()
			renderFrame(realm.venue.engine, dt)
		}

		const dispose = () => {
			realm.dispose()
			venue.dispose()
		}

		render(1000 / consts.simulationHz.max)

		return {playerId, realm, getActions, render, dispose}
	}
	catch (error) {
		venue.dispose()
		throw error
	}
})

const projectionsReady = (projections: Projections) => (
	new Promise<void>((resolve, reject) => {
		const ready = new WeakSet<Waiter<Projection>>()
		let done = false
		let dispose = () => {}

		const check = () => {
			if (done) return
			const waiting = [...projections.values()]
			if (waiting.every(w => ready.has(w))) {
				done = true
				dispose()
				resolve()
			}
		}

		dispose = effect(() => {
			const waiting = [...projections.values()]
			for (const waiter of waiting) {
				if (!ready.has(waiter))
					waiter.result.then(result => {
						if (done)
							return

						if (result.ok) {
							ready.add(waiter)
							check()
						}
						else {
							done = true
							dispose()
							reject(result.error)
						}
					})
			}
			check()
		})
	})
)

