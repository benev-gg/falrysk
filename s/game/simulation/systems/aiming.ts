
import {angleNormalize, clamp, degrees} from "@benev/math"
import {Pod} from "../parts/pod.js"
import {applySensitivity} from "../../../lib/tools/microverts.js"

const fov = degrees(90)
const microverts = 500

export const aiming = (pod: Pod) => () => {
	for (const [id, entity] of pod.entities.select("controlledBy", "gimbal")) {
		const actions = pod.actions.get(entity.controlledBy)
		if (actions) {
			const gimbal = entity.gimbal.dup()

			gimbal.x += applySensitivity(
				fov,
				microverts,
				actions.amble.look_right.value - actions.amble.look_left.value,
			)

			gimbal.y += applySensitivity(
				fov,
				microverts,
				actions.amble.look_up.value - actions.amble.look_down.value,
			)

			gimbal.x = angleNormalize(gimbal.x)
			gimbal.y = clamp(gimbal.y, degrees(-89.9), degrees(89.9))

			pod.entities.update(id, {gimbal})
		}
	}
}

