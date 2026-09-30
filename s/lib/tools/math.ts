
import {clamp, sum} from "@benev/math"

export function invert(x: number) {
	return 1 - x
}

export function smoothstep(x: number) {
	return x * x * (3 - (2 * x))
}

export function smootherstep(x: number) {
	return x * x * x * (x * (x * 6 - 15) + 10)
}

export function oldSmoothstep(value: number, min = 0, max = 1) {
	const t = clamp((value - min) / (max - min))
	return t * t * (3 - 2 * t)
}

export function average(...numbers: number[]) {
	if (numbers.length === 0) throw new Error("no numbers for average fn")
	return sum(...numbers) / numbers.length
}

