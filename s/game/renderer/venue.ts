
import {EntitiesReadonly} from "@benev/archimedes"
import {createEngine, createSceneContext, disposeEngine, disposeScene} from "@babylonjs/lite"

import {PlayerId} from "../simulation/types.js"
import {GameComponents} from "../simulation/parts/components.js"

export type Venue = Awaited<ReturnType<typeof setupVenue>>

export async function setupVenue({playerId, entities}: {
		playerId: PlayerId,
		entities: EntitiesReadonly<GameComponents>,
	}) {

	const canvas = document.createElement("canvas")
	const engine = await createEngine(canvas, {
		useFloatingOrigin: true,
		useHighPrecisionMatrix: true,
	})
	const scene = createSceneContext(engine)

	const dispose = () => {
		disposeScene(scene)
		disposeEngine(engine)
	}

	return {playerId, entities, canvas, engine, scene, dispose}
}

