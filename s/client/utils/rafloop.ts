
export function rafloop(fn: (dt: number) => void) {
	let running = true
	let last = performance.now()
	let id = 0

	function frame(now: number) {
		if (!running) return

		const dt = now - last
		last = now

		fn(dt)
		id = requestAnimationFrame(frame)
	}

	id = requestAnimationFrame(frame)

	return () => {
		running = false
		cancelAnimationFrame(id)
	}
}

