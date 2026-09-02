
import {addToScene, createEngine, createHemisphericLight, createSceneContext, disposeEngine, disposeScene, loadGltf} from "@babylonjs/lite"
import {AnyCanvas} from "../../buddy/types.js"
import {AssetDepot} from "../../buddy/depot.js"

export type Venue = Awaited<ReturnType<typeof makeVenue>>

export async function makeVenue(options: {
		canvas: AnyCanvas
		artGlb: ArrayBuffer
	}) {

	const canvas = document.createElement("canvas")
	const engine = await createEngine(canvas)
	const scene = createSceneContext(engine)

	const light = createHemisphericLight([0, 1, 0], 1)
	addToScene(scene, light)

	const container = await loadGltf(engine, options.artGlb)
	const depot = new AssetDepot(container)

	const dispose = () => {
		disposeScene(scene)
		disposeEngine(engine)
	}

	return {canvas, engine, scene, light, depot, dispose}
}

