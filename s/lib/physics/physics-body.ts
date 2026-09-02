
import {Rect} from "@benev/math"

export class PhysicsBody {
	constructor(
		public id: string,
		public rect: Rect,
		public mass: number | undefined,
	) {}
}

