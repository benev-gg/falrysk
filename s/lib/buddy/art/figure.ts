
import {Quat, Vec3} from "@benev/math"

/** handle to manipulate a 3d art instance which is spatially located in the world */
export class Figure {
	visible = true
	scale = new Vec3(1, 1, 1)
	position = new Vec3()
	rotation = new Quat()

	constructor(public readonly dispose: () => void) {}
}

