
import {consolidateSystems} from "@benev/archimedes"
import {Pod} from "./parts/pod.js"
import {aiming} from "./systems/aiming.js"
import {clock_update} from "./systems/clock_update.js"
import {spawn_spectator} from "./systems/spawn_spectator.js"

export const systems = consolidateSystems<Pod>({
	clock_update,
	spawn_spectator,
	aiming,
})

