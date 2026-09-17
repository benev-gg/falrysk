
import {XyArray} from "@benev/math"
import {Actions} from "@benev/tact"
import {Id} from "@benev/archimedes"
import {RMap, Signal, Waiter} from "@e280/strata"

import {Realm} from "../../../game/renderer/realm.js"
import {Catalog} from "../../../game/renderer/catalog.js"
import {PlayerId} from "../../../game/simulation/types.js"
import {Simulation} from "../../../game/simulation/simulation.js"
import {bindings} from "../../../game/simulation/parts/bindings.js"
import {GameComponents} from "../../../game/simulation/parts/components.js"

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

export type RenderWorkerFns = {
	initialize(options: {
		playerId: PlayerId
		canvas: OffscreenCanvas
		entities: [id: Id, components: Partial<GameComponents>][]
		dimensions: XyArray
	}): Promise<void>

	setDimensions(x: number, y: number): Promise<void>
}

