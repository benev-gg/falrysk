
import {consolidateSystems} from "@benev/archimedes"
import {clock_update} from "./systems/clock_update.js"
import {gimbal_update} from "./systems/gimbal_update.js"

export const setupRenderSystems = consolidateSystems({
	clock_update,
	gimbal_update,
})

