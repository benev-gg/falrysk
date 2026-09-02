
export class Pulser {
	#next
	#target

	constructor(hz: number, now = performance.now()) {
		this.#target = 1000 / hz
		this.#next = now + this.#target
	}

	check(now = performance.now()) {
		if (now >= this.#next) {
			this.#next = now + this.#target
			return true
		}
		return false
	}
}

