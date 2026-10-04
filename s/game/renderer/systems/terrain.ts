
import {Rect, Vec2} from "@benev/math"
import {addToScene} from "@babylonjs/lite"
import {lifecycle} from "@benev/archimedes"

import {Realm} from "../realm.js"
import {consts} from "../../../consts.js"
import {makeTerrain} from "../parts/make-terrain.js"
import {makeMaterial} from "../parts/make-material.js"
import {Worldspace2} from "../../uni/coords/worldspace.js"
import {makeLandscape} from "../../uni/procgen/landscape/landscape.js"

export const terrain_rendering = (realm: Realm) => lifecycle(
	realm.entities,
	["landscape"],
	(_id, entity) => {
		const {scene, engine} = realm

		const material = makeMaterial(.8, .8, .8)

		addToScene(scene, makeTerrain({
			engine,
			material,
			landscape: makeLandscape(entity.landscape),
			resolution: Vec2.fill(consts.world.resolution),
			rect: new Rect(Worldspace2.zero(), entity.landscape.size),
		}))

		return {
			tick: () => {},
			exit: () => {},
		}
	},
)

