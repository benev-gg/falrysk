
import {got} from "@e280/stz"
import {XyArray} from "@benev/math"
import {renderFrame} from "@babylonjs/lite"
import {Components, Entities, Id} from "@benev/archimedes"

import {makeRealm} from "./realm.js"
import {RendererFns} from "./types.js"
import {rafloop} from "../../lib/web/rafloop.js"
import {Realm} from "../../game/renderer/realm.js"
import {Catalog} from "../../game/renderer/catalog.js"
import {PlayerId} from "../../game/simulation/types.js"
import {setupScene} from "../../game/renderer/scene.js"
import {setupRenderSystems} from "../../game/renderer/systems.js"
import {GameComponents} from "../../game/simulation/parts/components.js"

export function setupRenderWorker(): RendererFns {
	let state: undefined | {
		entities: Entities<Components>
		realm: Realm
		render: (dt: number) => void
		dispose: () => void
	}

	return {
		async initialize(options: {
				playerId: PlayerId
				canvas: OffscreenCanvas
				entities: [id: Id, components: Partial<GameComponents>][]
				dimensions: XyArray
				catalog: Catalog
			}) {

			const {canvas, playerId, dimensions, catalog} = options
			const entities = new Entities(options.entities)

			const realm = await makeRealm({
				canvas,
				catalog,
				playerId,
				entities: entities.readonly,
			})

			realm.setRenderSize(...dimensions)
			const runRenderSystems = setupRenderSystems(realm)

			await setupScene(realm)

			const render = (dt: number) => {
				runRenderSystems()
				renderFrame(realm.engine, dt)
			}

			render(1000 / 60)
			const stop = rafloop(render)
			const dispose = () => {
				stop()
				realm.dispose()
			}
			state = {realm, entities, render, dispose}
		},

		async setRenderSize(x: number, y: number) {
			got(state).realm.setRenderSize(x, y)
		},
	}
}

