
export class SimulationClock {
	tick = 0
	elapsed = 0
	delta

	constructor(readonly hz: number) {
		this.delta = 1000 / hz
	}

	update() {
		this.tick++
		this.elapsed += this.delta
	}

	get deltaSeconds() {
		return this.delta / 1000
	}

	get elapsedSeconds() {
		return this.elapsed / 1000
	}
}

