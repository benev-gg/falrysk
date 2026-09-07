
import {consolidate} from "@benev/archimedes"
import {Realm} from "./realm.js"
import {timing_update} from "./systems/timing_update.js"

export const setupRender = (realm: Realm) => consolidate(realm, {
	timing_update,
})

