
import {degrees} from "@benev/math"
import {Pod} from "../parts/pod.js"

const sens = 1

export const aiming = (pod: Pod) => () => {
	for (const [id, entity] of pod.entities.select("controlledBy", "gimbal")) {
		const actions = pod.actions.get(entity.controlledBy)
		if (actions) {
			const gimbal = entity.gimbal.dup()
			gimbal.x -= degrees(actions.amble.look_left.value * sens)
			gimbal.x += degrees(actions.amble.look_right.value * sens)
			gimbal.y += degrees(actions.amble.look_up.value * sens)
			gimbal.y -= degrees(actions.amble.look_down.value * sens)
			pod.entities.update(id, {gimbal})
		}
	}
}

