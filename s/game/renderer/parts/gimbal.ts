
import {createFreeCamera} from "@babylonjs/lite"
import {Worldspace3} from "../../uni/coords/worldspace.js"

export class Gimbal {
	readonly camera

	yaw = 0
	pitch = 0
	radius = 0
	position = new Worldspace3()

	constructor() {
		this.camera = createFreeCamera(
			new Worldspace3(0, 0, 0).toBabylon(),
			new Worldspace3(0, 1, 0).toBabylon(),
		)
	}

	update() {
		const forward = this.#forward()

		this.camera.position.copyFrom(
			this.position.dup().sub(forward.dup().mulBy(this.radius)).toBabylon()
		)

		this.camera.target.copyFrom(
			this.position.dup().add(forward).toBabylon()
		)
	}

	#forward() {
		const {yaw, pitch} = this
		const cosPitch = Math.cos(pitch)

		return new Worldspace3(
			Math.sin(yaw) * cosPitch,
			Math.cos(yaw) * cosPitch,
			Math.sin(pitch),
		)
	}
}

