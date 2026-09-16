
import {consolidate} from "@benev/archimedes"
import {Realm} from "./realm.js"
import {clock_update} from "./systems/clock_update.js"
import {gimbal_update} from "./systems/gimbal_update.js"

export const setupRenderSystems = (realm: Realm) => consolidate(realm, {
	clock_update,
	gimbal_update,
})

