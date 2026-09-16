
export class RenderClock {
	frames = 0
	delta = 1000 / 60
	#start = performance.now()
	#last = this.#start

	update() {
		this.frames++
		this.delta = performance.now() - this.#last
	}

	get elapsed() {
		return performance.now() - this.#start
	}
}

