
import {addToScene, createHemisphericLight, enableStandardVertexColors, registerScene} from "@babylonjs/lite"

import {Realm} from "./realm.js"
import {consts} from "../../consts.js"
import {makeSea} from "./parts/make-sea.js"
import {makeMaterial} from "./parts/make-material.js"
import {Worldspace2} from "../uni/coords/worldspace.js"

enableStandardVertexColors()

export async function setupScene(realm: Realm) {
	const {scene, engine} = realm

	scene.clearColor = {r: 0, b: 0, g: 0, a: 1}
	const light = createHemisphericLight([.123, 1, .234], 1)
	addToScene(scene, light)

	scene.camera = realm.gimbal.camera
	
	const size = Worldspace2.all(consts.world.size)
	const middle = size.dup().divBy(2).addZ()
	const water = makeMaterial(.1, .2, .5, .8)

	const sea = makeSea(engine, water, consts.world.size)
	sea.position.copyFrom(middle.toBabylon())
	addToScene(scene, sea)

	// const box = makeBox(engine, 10, material)
	// box.position.copyFrom(middle.toBabylon())
	// addToScene(scene, box)

	await registerScene(scene)
}

