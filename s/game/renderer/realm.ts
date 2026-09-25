
import {Vec2} from "@benev/math"
import {disposer} from "@e280/stz"
import {EntitiesReadonly} from "@benev/archimedes"
import {createEngine, createSceneContext, disposeEngine, disposeScene, setEngineSize} from "@babylonjs/lite"

import {Catalog} from "./catalog.js"
import {Gimbal} from "./parts/gimbal.js"
import {PlayerId} from "../simulation/types.js"
import {AnyCanvas} from "../../lib/buddy/types.js"
import {RenderClock} from "./parts/render-clock.js"

export type Realm = Awaited<ReturnType<typeof makeRealm>>

export async function makeRealm(options: {
		canvas: AnyCanvas
		playerId: PlayerId,
		entities: EntitiesReadonly,
		catalog: Catalog
	}) {

	const dispose = disposer()

	const engine = await createEngine(options.canvas, {
		useFloatingOrigin: true,
		useHighPrecisionMatrix: true,
	})

	const scene = createSceneContext(engine)

	dispose.schedule(() => {
		disposeScene(scene)
		disposeEngine(engine)
	})

	return {
		...options,
		engine,
		scene,
		gimbal: new Gimbal(),
		clock: new RenderClock(),
		pointer: new Vec2(),
		setRenderSize: ({x, y}: Vec2) => setEngineSize(engine, x, y),
		dispose,
	}
}

