
import {defer} from "@e280/stz"
import {Vec2, XyArray} from "@benev/math"
import {signal, Signal} from "@e280/strata"
import {Components, Entities, Id} from "@benev/archimedes"
import {renderFrame, waitForGpuIdle} from "@babylonjs/lite"

import {Realm} from "./realm.js"
import {Catalog} from "./catalog.js"
import {makeRealm} from "./realm.js"
import {setupScene} from "./scene.js"
import {RendererFns} from "./types.js"
import {PlayerId} from "../simulation/types.js"
import {setupRenderSystems} from "./systems.js"
import {rafloop} from "../../lib/web/rafloop.js"
import {GameComponents} from "../simulation/parts/components.js"

export type Venue = {
	entities: Entities<Components>
	realm: Realm
	$resize: Signal<Vec2 | null>
	render: (dt: number) => void
	dispose: () => void
}

export function setupRenderer(): RendererFns {
	const ready = defer<Venue>()

	return {
		async initialize(options: {
				playerId: PlayerId
				canvas: OffscreenCanvas
				entities: [id: Id, components: Partial<GameComponents>][]
				dimensions: XyArray
				catalog: Catalog
			}) {

			const {canvas, playerId, dimensions, catalog} = options

			const $resize = signal<Vec2 | null>(Vec2.from(dimensions))

			const entities = new Entities(options.entities)

			const realm = await makeRealm({
				canvas,
				catalog,
				playerId,
				entities: entities.readonly,
			})

			const runRenderSystems = setupRenderSystems(realm)

			await setupScene(realm)

			const render = (dt: number) => {
				const resize = $resize()
				if (resize) realm.setRenderSize(resize)
				runRenderSystems()
				renderFrame(realm.engine, dt)
			}

			const stop = rafloop(render)

			const dispose = () => {
				stop()
				realm.dispose()
			}

			ready.resolve({realm, entities, $resize, render, dispose})

			render(1000 / 60)
			await waitForGpuIdle(realm.engine)
		},

		async setRenderSize(x: number, y: number) {
			const venue = await ready
			venue.$resize(new Vec2(x, y))
		},
	}
}

