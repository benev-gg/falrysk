
import {consolidate} from "@benev/archimedes"
import {Realm} from "./realm.js"
import {gimbal_update} from "./systems/gimbal_update.js"
import {timing_update} from "./systems/timing_update.js"

export const setupRender = (realm: Realm) => consolidate(realm, {
	timing_update,
	gimbal_update,
})

