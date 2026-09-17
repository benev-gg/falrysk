
import {clamp} from "@benev/math"

export function smoothstep(value: number, min = 0, max = 1) {
	const t = clamp((value - min) / (max - min))
	return t * t * (3 - 2 * t)
}

