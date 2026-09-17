
import {EntitiesReadonly} from "@benev/archimedes"
import {createEngine, createSceneContext, disposeEngine, disposeScene, setEngineSize} from "@babylonjs/lite"

import {Catalog} from "./catalog.js"
import {PlayerId} from "../simulation/types.js"
import {AnyCanvas} from "../../lib/buddy/types.js"
import {GameComponents} from "../simulation/parts/components.js"

export type Venue = Awaited<ReturnType<typeof setupVenue>>

export async function setupVenue({canvas, playerId, entities, catalog}: {
		canvas: AnyCanvas
		playerId: PlayerId,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog
	}) {

	const engine = await createEngine(canvas, {
		useFloatingOrigin: true,
		useHighPrecisionMatrix: true,
	})

	const scene = createSceneContext(engine)

	const dispose = () => {
		disposeScene(scene)
		disposeEngine(engine)
	}

	function setRenderSize(width: number, height: number) {
		setEngineSize(engine, width, height)
	}

	return {playerId, entities, canvas, engine, scene, catalog, setRenderSize, dispose}
}

