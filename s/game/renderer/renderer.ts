
import {got} from "@e280/stz"
import {Vec2, XyArray} from "@benev/math"
import {renderFrame, waitForGpuIdle} from "@babylonjs/lite"
import {Components, Entities, Id} from "@benev/archimedes"

import {makeRealm} from "./realm.js"
import {RendererFns} from "./types.js"
import {rafloop} from "../../lib/web/rafloop.js"
import {Realm} from "./realm.js"
import {Catalog} from "./catalog.js"
import {PlayerId} from "../simulation/types.js"
import {setupScene} from "./scene.js"
import {setupRenderSystems} from "./systems.js"
import {GameComponents} from "../simulation/parts/components.js"

export function setupRenderer(): RendererFns {
	let state: undefined | {
		entities: Entities<Components>
		realm: Realm
		resizeWhenReady: undefined | Vec2
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
				if (!state) return
				if (state.resizeWhenReady) {
					const {x, y} = state.resizeWhenReady
					realm.setRenderSize(x, y)
					state.resizeWhenReady = undefined
				}
				runRenderSystems()
				renderFrame(realm.engine, dt)
			}

			const stop = rafloop(render)
			const dispose = () => {
				stop()
				realm.dispose()
			}
			state = {realm, entities, resizeWhenReady: undefined, render, dispose}
			render(1000 / 60)
			await waitForGpuIdle(realm.engine)
		},

		async setRenderSize(x: number, y: number) {
			got(state).resizeWhenReady = new Vec2(x, y)
		},
	}
}

