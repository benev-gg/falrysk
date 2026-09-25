
import {consolidateSystems} from "@benev/archimedes"
import {Pod} from "./parts/pod.js"
import {clock_update} from "./systems/clock_update.js"

export const systems = consolidateSystems<Pod>({
	clock: {
		clock_update,
	},
})

