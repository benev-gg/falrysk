
import {Actions} from "@benev/tact"
import {renderFrame} from "@babylonjs/lite"
import {disposer, got, gotOk} from "@e280/stz"
import {EntitiesReadonly} from "@benev/archimedes"
import {effect, RMap, signal, Signal, wait, Waiter} from "@e280/strata"

import {Basis} from "../types.js"
import {consts} from "../../consts.js"
import {Realm} from "../../game/renderer/realm.js"
import {LocalPlayers} from "./inputs/local-players.js"
import {Catalog} from "../../game/renderer/catalog.js"
import {PlayerId} from "../../game/simulation/types.js"
import {setupVenue} from "../../game/renderer/venue.js"
import {setupScene} from "../../game/renderer/scene.js"
import {smartCycle} from "../../lib/tools/smart-cycle.js"
import {setupRender} from "../../game/renderer/render.js"
import {Simulation} from "../../game/simulation/simulation.js"
import {bindings} from "../../game/simulation/parts/bindings.js"
import {GameComponents} from "../../game/simulation/parts/components.js"

export type Seats = RMap<PlayerId, Seat>

export type Director = {
	$playing: Signal<boolean>
	simulation: Simulation
	seats: Seats
	dispose: () => void
}

export type Seat = {
	playerId: PlayerId
	$waiter: Signal<Waiter<Projector>>
	rebuild: (catalog: Catalog) => Promise<void>
	dispose: () => Promise<void>
}

export type Projector = {
	realm: Realm
	playerId: PlayerId
	render: (dt: number) => void
	getActions: () => Actions<typeof bindings>
	dispose: () => void
}

export async function makeDirector(basis: Basis): Promise<Director> {
	const catalog = new Catalog()
	const dispose = disposer()
	const seats = new RMap<PlayerId, Seat>()
	const simulation = new Simulation()
	const entities = simulation.entities.readonly
	const players = new LocalPlayers()
	const $playing = signal(false)

	// start running the simulation
	dispose.schedule(
		smartCycle(consts.simulationHz.max, 3, async() => {
			players.update(performance.now(), basis.deck.ports)

			if ($playing())
				simulation.simulate(players.actions)
		})
	)

	// ensure one projection per player
	dispose.schedule(
		effect(() => {
			syncFreshSeats(players, seats, entities, catalog)
			syncStaleSeats(players, seats)
		})
	)

	// dispose all projections when director is cleaned up
	dispose.schedule(
		() => [...seats.values()].map(seat => seat.dispose())
	)

	players.update(performance.now(), basis.deck.ports)
	await allProjectorsReady(seats)
	return {simulation, seats, $playing, dispose}
}

function syncFreshSeats(
		players: LocalPlayers,
		seats: Seats,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog,
	) {
	for (const playerId of players.actions.keys()) {
		if (!seats.has(playerId))
			seats.set(playerId, makeSeat(playerId, players, entities, catalog))
	}
}

function syncStaleSeats(
		players: LocalPlayers,
		seats: Seats,
	) {
	for (const [playerId, seat] of seats) {
		if (!players.actions.has(playerId)) {
			seat.dispose()
			seats.delete(playerId)
		}
	}
}

export function makeSeat(
		playerId: PlayerId,
		players: LocalPlayers,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog,
	) {

	const $waiter = signal(wait(makeProjector(playerId, players, entities, catalog)))

	const dispose = async() => {
		const result = await $waiter().result
		if (result.ok) return result.value.dispose()
	}

	const rebuild = async(catalog: Catalog) => {
		dispose()
		const w = wait(makeProjector(playerId, players, entities, catalog))
		$waiter(w)
		gotOk(await w.result)
	}

	return {playerId, $waiter, rebuild, dispose}
}

export async function makeProjector(
		playerId: PlayerId,
		players: LocalPlayers,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog,
	) {

	const venue = await setupVenue({playerId, entities, catalog})

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
}

export async function allProjectorsReady(seats: Seats) {
	await Promise.all(
		[...seats.values()]
			.map(async seat => gotOk(await seat.$waiter().result))
	)
}

