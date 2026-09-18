
import {time} from "@e280/stz"
import {degrees, Rect, Vec2} from "@benev/math"
import {addToScene, createHemisphericLight, registerScene} from "@babylonjs/lite"

import {Realm} from "./realm.js"
import {makeSea} from "./parts/make-sea.js"
import {Oracle} from "../uni/procgen/oracle.js"
import {makeTerrain} from "./parts/make-terrain.js"
import {makeMaterial} from "./parts/make-material.js"
import {Worldspace2} from "../uni/coords/worldspace.js"

export async function setupScene(realm: Realm) {
	const {scene, engine} = realm

	scene.clearColor = {r: 0, b: 0, g: 0, a: 1}
	const light = createHemisphericLight([.123, 1, .234], 1)
	addToScene(scene, light)

	scene.camera = realm.gimbal.camera
	
	const oracle = new Oracle({
		seed: Math.floor(Date.now() / time.days(1)),
		size: new Worldspace2(30_000, 30_000),
	})

	const middle = oracle.options.size.dup().divBy(2).addZ()
	const material = makeMaterial(.8, .5, 0)
	const water = makeMaterial(.1, .2, .5)

	realm.gimbal.position = middle
	realm.gimbal.radius = 20_000
	realm.gimbal.pitch = degrees(-30)
	realm.gimbal.camera.nearPlane = 1
	realm.gimbal.camera.farPlane = 50_000

	addToScene(scene, makeTerrain({
		engine,
		material,
		oracle,
		resolution: Vec2.new(1024, 1024),
		rect: new Rect(Worldspace2.zero(), oracle.options.size),
	}))

	const sea = makeSea(engine, water, 31_000)
	sea.position.copyFrom(middle.toBabylon())
	addToScene(scene, sea)

	// const box = makeBox(engine, 10, material)
	// box.position.copyFrom(middle.toBabylon())
	// addToScene(scene, box)

	await registerScene(scene)
}

