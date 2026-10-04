
import {createFreeCamera} from "@babylonjs/lite"
import {Position} from "../../uni/units/position.js"
import {angleNormalize, clamp, degrees} from "@benev/math"

export class Gimbal {
	readonly camera

	yaw = 0
	pitch = 0
	radius = 0
	position = new Position()

	constructor() {
		this.camera = createFreeCamera(
			new Position(0, 0, 0).babylonify(),
			new Position(0, 1, 0).babylonify(),
		)
	}

	update() {
		this.#constrain()
		const forward = this.#forward()

		this.camera.position.copyFrom(
			this.position.dup().sub(forward.dup().mulBy(this.radius)).babylonify()
		)

		this.camera.target.copyFrom(
			this.position.dup().add(forward).babylonify()
		)
	}

	#constrain() {
		const freedom = degrees(89.9)
		this.yaw = angleNormalize(this.yaw)
		this.pitch = clamp(this.pitch, -freedom, freedom)
	}

	#forward() {
		const {yaw, pitch} = this
		const cosPitch = Math.cos(pitch)
		return new Position(
			Math.sin(yaw) * cosPitch,
			Math.cos(yaw) * cosPitch,
			Math.sin(pitch),
		)
	}
}

