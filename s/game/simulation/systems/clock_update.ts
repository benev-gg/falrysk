
import {seed} from "@e280/stz"
import {Pod} from "../parts/pod.js"

export const clock_update = (pod: Pod) => () => {
	pod.timing.update()

	if (pod.timing.tick % 60 === 0)
		pod.rand.random = seed(pod.timing.tick)
}

