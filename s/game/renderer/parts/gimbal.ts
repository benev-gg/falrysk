
import {Vec3} from "@benev/math"
import {createFreeCamera} from "@babylonjs/lite"

export class Gimbal {
	readonly camera

	pivot = new Vec3()
	yaw = 0
	pitch = 0
	radius = 0

	constructor() {
		this.camera = createFreeCamera(
			new Vec3(0, 0, 0),
			new Vec3(0, 0, 1),
		)
	}

	update() {
		const forward = this.#forward()

		this.camera.position.copyFrom(
			this.pivot.dup().sub(forward.dup().mulBy(this.radius))
		)

		this.camera.target.copyFrom(
			this.pivot.dup().add(forward)
		)
	}

	#forward() {
		const {yaw, pitch} = this
		const cosPitch = Math.cos(pitch)

		return new Vec3(
			Math.sin(yaw) * cosPitch,
			Math.sin(pitch),
			Math.cos(yaw) * cosPitch,
		)
	}
}

