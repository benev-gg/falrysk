
import {consolidateSystems} from "@benev/archimedes"
import {terrain_rendering} from "./systems/terrain.js"
import {clock_update} from "./systems/clock_update.js"
import {gimbal_update} from "./systems/gimbal_update.js"

export const setupRenderSystems = consolidateSystems({
	terrain_rendering,
	clock_update,
	gimbal_update,
})

