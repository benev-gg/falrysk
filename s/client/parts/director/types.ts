
import {Actions} from "@benev/tact"
import {RMap, Signal, Waiter} from "@e280/strata"

import {Realm} from "../../../game/renderer/realm.js"
import {Catalog} from "../../../game/renderer/catalog.js"
import {PlayerId} from "../../../game/simulation/types.js"
import {Simulation} from "../../../game/simulation/simulation.js"
import {bindings} from "../../../game/simulation/parts/bindings.js"

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

