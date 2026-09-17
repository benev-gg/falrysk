
import {got} from "@e280/stz"
import {XyArray} from "@benev/math"
import {Portal} from "@e280/renraku"
import {renderFrame} from "@babylonjs/lite"
import {Components, Entities, Id} from "@benev/archimedes"
import {offerWorkerPort, webAutoTransfer} from "@e280/renraku/web"

import {RenderWorkerFns} from "./types.js"
import {rafloop} from "../../../lib/web/rafloop.js"
import {Realm} from "../../../game/renderer/realm.js"
import {Catalog} from "../../../game/renderer/catalog.js"
import {setupVenue} from "../../../game/renderer/venue.js"
import {PlayerId} from "../../../game/simulation/types.js"
import {setupScene} from "../../../game/renderer/scene.js"
import {setupRenderSystems} from "../../../game/renderer/systems.js"
import {GameComponents} from "../../../game/simulation/parts/components.js"

let state: undefined | {
	entities: Entities<Components>
	realm: Realm
	render: (dt: number) => void
	stop: () => void
}

const fns: RenderWorkerFns = {
	async initialize(options: {
			playerId: PlayerId
			canvas: OffscreenCanvas
			entities: [id: Id, components: Partial<GameComponents>][]
			dimensions: XyArray
		}) {

		const {canvas, playerId, dimensions} = options
		const catalog = new Catalog()
		const entities = new Entities(options.entities)

		const venue = await setupVenue({
			canvas,
			catalog,
			playerId,
			entities: entities.readonly,
		})

		venue.setRenderSize(...dimensions)
		const realm = new Realm(venue)
		const runRenderSystems = setupRenderSystems(realm)

		await setupScene(realm)

		const render = (dt: number) => {
			runRenderSystems()
			renderFrame(realm.venue.engine, dt)
		}

		render(1000 / 60)
		const stop = rafloop(render)
		state = {realm, entities, render, stop}
	},

	async setDimensions(x: number, y: number) {
		got(state).realm.venue.setRenderSize(x, y)
	},
}

const port = await offerWorkerPort()

new Portal({port, fns, autoTransfer: webAutoTransfer})

