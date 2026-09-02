
import {Circle, Rect} from "@benev/math"

export class PhysBox {
	constructor(
		public id: string,
		public rect: Rect,
		public mass: number | undefined,
	) {}
}

export class PhysCircle {
	constructor(
		public id: string,
		public circle: Circle,
		public mass: number | undefined,
	) {}
}

export type Phys =
	| PhysBox
	| PhysCircle

