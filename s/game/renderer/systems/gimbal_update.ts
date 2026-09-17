
import {Realm} from "../realm.js"

export const gimbal_update = (realm: Realm) => () => {
	const {gimbal} = realm
	gimbal.yaw = realm.clock.elapsed * 0.0001
	gimbal.update()
}

