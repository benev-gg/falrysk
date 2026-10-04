
import {Vec2} from "@benev/math"
import {Position} from "./position.js"

export class Coordinates extends Vec2 {
	addZ(z = 0) {
		return new Position(this.x, this.y, z)
	}
}

