
import {consolidate} from "@benev/archimedes"
import {Pod} from "./parts/pod.js"
import {clock_update} from "./systems/clock_update.js"

export const setupSimulationSystems = (pod: Pod) => consolidate(pod, {
	clock: {
		clock_update,
	},
})

