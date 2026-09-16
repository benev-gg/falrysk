
import {Realm} from "./realm.js"
import {addToScene, createBox, createHemisphericLight, createStandardMaterial, registerScene} from "@babylonjs/lite"

export async function setupScene(realm: Realm) {
	const {scene, engine} = realm.venue

	scene.clearColor = {r: 0, b: 0, g: 0, a: 1}
	const light = createHemisphericLight([.123, 1, .234], 1)
	addToScene(scene, light)

	scene.camera = realm.gimbal.camera

	const material = createStandardMaterial()
	material.diffuseColor = [.8, .5, 0]

	const box = createBox(engine, {size: 1})
	box.material = material
	addToScene(scene, box)

	await registerScene(scene)
}

