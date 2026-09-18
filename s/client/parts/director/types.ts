
import {RMap, Signal, Wait} from "@e280/strata"
import {WorkerConnection} from "@e280/renraku/web"

import {PlayerId} from "../../../game/simulation/types.js"
import {Simulation} from "../../../game/simulation/simulation.js"
import {RenderWorkerFns} from "../../../game/renderer/types.js"

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
	dispose: () => Promise<void>
}

export type Projector = {
	playerId: PlayerId
	canvas: HTMLCanvasElement
	worker: WorkerConnection<RenderWorkerFns>
}

