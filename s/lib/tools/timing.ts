
import {clamp} from "@benev/math"

export class Timing {
	#tick = 0
	#previous = performance.now()

	#delta
	#minDelta
	#maxDelta
	#elapsed = 0

	constructor(
			minHz = 10,
			maxHz = 120,
		) {
		this.#minDelta = 1000 / maxHz
		this.#maxDelta = 1000 / minHz
		this.#delta = this.#maxDelta
	}

	update() {
		this.#tick++
		const now = performance.now()
		this.#delta = clamp(now - this.#previous, this.#minDelta, this.#maxDelta)
		this.#previous = now
		this.#elapsed += this.#delta
	}

	get tick() {
		return this.#tick
	}

	get delta() {
		return this.#delta
	}

	get deltaSeconds() {
		return this.#delta / 1000
	}

	get elapsed() {
		return this.#elapsed
	}
}

