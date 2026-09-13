
import {Vec2} from "@benev/math"

export class Proximal {
	dispose = () => {}
	#was = false
	#nearby = false

	get nearby() {
		return this.#nearby
	}

	on(distance: number, alpha: Vec2, bravo: Vec2, fn: () => () => void) {
		const threshold = distance ** 2
		const near = alpha.distanceSquared(bravo) < threshold
		const changed = near !== this.#was

		this.#was = near
		this.#nearby = near

		if (changed && near) {
			this.dispose()
			this.dispose = fn()
		}

		else if (changed && !near) {
			this.dispose()
			this.dispose = () => {}
		}
	}

	invalidate() {
		this.#was = false
	}
}

