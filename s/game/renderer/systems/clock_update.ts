
import {Realm} from "../realm.js"

export const clock_update = (realm: Realm) => () => {
	realm.clock.update()
}

