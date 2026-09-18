
import {RMap, Signal, Wait} from "@e280/strata"
import {WorkerConnection} from "@e280/renraku/web"

import {Catalog} from "../../../game/renderer/catalog.js"
import {PlayerId} from "../../../game/simulation/types.js"
import {RendererFns} from "../../../game/renderer/types.js"
import {Simulation} from "../../../game/simulation/simulation.js"

export type Seats = RMap<PlayerId, Seat>

export type Director = {
	$playing: Signal<boolean>
	simulation: Simulation
	seats: Seats
	dispose: () => void
}

export type Seat = {
	playerId: PlayerId
	$wait: Signal<Wait<Projector>>
	rebuild(catalog: Catalog): Promise<void>
	dispose: () => Promise<void>
}

export type Projector = {
	playerId: PlayerId
	canvas: HTMLCanvasElement
	renderer: WorkerConnection<RendererFns>
	dispose: () => void
}

