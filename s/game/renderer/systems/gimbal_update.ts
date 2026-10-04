
import {degrees} from "@benev/math"
import {Realm} from "../realm.js"
import {consts} from "../../../consts.js"
import {Worldspace2} from "../../uni/coords/worldspace.js"

export const gimbal_update = (realm: Realm) => () => {
	const {gimbal} = realm

	const size = Worldspace2.all(consts.world.size)
	const middle = size.dup().divBy(2).addZ()

	gimbal.position = middle
	gimbal.radius = 35_000
	gimbal.yaw = realm.clock.elapsed * 0.0001
	gimbal.pitch = degrees(-15)
	gimbal.camera.fov = degrees(60)
	gimbal.camera.nearPlane = 10
	gimbal.camera.farPlane = 100_000

	for (const [_id, entity] of realm.entities.select("controlledBy", "gimbal")) {
		if (entity.controlledBy === realm.playerId) {
			gimbal.radius = 0.01
			gimbal.yaw = entity.gimbal.x
			gimbal.pitch = entity.gimbal.y
			gimbal.camera.fov = degrees(90)
		}
	}

	gimbal.update()
}

