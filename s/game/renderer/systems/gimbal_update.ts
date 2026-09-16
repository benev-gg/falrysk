
import {degrees} from "@benev/math"
import {Realm} from "../realm.js"

export const gimbal_update = (realm: Realm) => () => {
	const {gimbal} = realm
	gimbal.radius = 5
	gimbal.pitch = degrees(-20)
	gimbal.yaw = realm.clock.elapsed * 0.001
	gimbal.update()
}

