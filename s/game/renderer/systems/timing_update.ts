
import {Realm} from "../realm.js"

export const timing_update = (realm: Realm) => () => {
	realm.timing.update()
}

