
import {rand32} from "@e280/stz"
import {degrees, Rect, Vec2} from "@benev/math"
import {addToScene, createHemisphericLight, enableStandardVertexColors, registerScene} from "@babylonjs/lite"

import {Realm} from "./realm.js"
import {consts} from "../../consts.js"
import {makeSea} from "./parts/make-sea.js"
import {makeTerrain} from "./parts/make-terrain.js"
import {makeMaterial} from "./parts/make-material.js"
import {Worldspace2} from "../uni/coords/worldspace.js"
import {logLandscapeStats} from "../uni/procgen/landscape/stats.js"
import {makeLandscape} from "../uni/procgen/landscape/landscape.js"

enableStandardVertexColors()

export async function setupScene(realm: Realm) {
	const {scene, engine} = realm

	scene.clearColor = {r: 0, b: 0, g: 0, a: 1}
	const light = createHemisphericLight([.123, 1, .234], 1)
	addToScene(scene, light)

	scene.camera = realm.gimbal.camera
	
	const landscape = makeLandscape({
		// seed: 1,
		// seed: Math.floor(Date.now() / time.days(1)),
		seed: rand32(),
		size: Worldspace2.all(consts.world.size),
	})

	logLandscapeStats(landscape)

	const size = landscape.getSize()
	const middle = size.dup().divBy(2).addZ()
	const material = makeMaterial(.8, .8, .8)
	const water = makeMaterial(.1, .2, .5, .8)

	realm.gimbal.position = middle
	realm.gimbal.radius = 30_000
	realm.gimbal.pitch = degrees(-10)
	realm.gimbal.camera.fov = degrees(60)
	realm.gimbal.camera.nearPlane = 10
	realm.gimbal.camera.farPlane = 100_000

	addToScene(scene, makeTerrain({
		engine,
		material,
		landscape,
		resolution: Vec2.all(consts.world.resolution),
		rect: new Rect(Worldspace2.zero(), size),
	}))

	const sea = makeSea(engine, water, consts.world.size)
	sea.position.copyFrom(middle.toBabylon())
	addToScene(scene, sea)

	// const box = makeBox(engine, 10, material)
	// box.position.copyFrom(middle.toBabylon())
	// addToScene(scene, box)

	await registerScene(scene)
}

