
import {makeId} from "@benev/archimedes"
import {degrees, Vec2} from "@benev/math"
import {Pod} from "../parts/pod.js"

export const spawn_spectator = (pod: Pod) => () => {
	for (const [id, actions] of pod.actions) {
		if (actions.amble.use.changedDown) {
			const notYet = pod.entities.select("controlledBy", "gimbal")
				.map(([_, e]) => e.controlledBy === id)
				.length === 0

			if (notYet) {
				console.log("spawn spectator")
				pod.entities.set(makeId(), {
					controlledBy: id,
					gimbal: new Vec2(0, degrees(90)),
				})
			}
		}
	}
}

