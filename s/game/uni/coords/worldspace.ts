
import {Vec3 as BabVec3} from "@babylonjs/lite"
import {clamp, Vec2, Vec3, Xy, XyArray, Xyz, XyzArray} from "@benev/math"

export class Worldspace2 extends Vec2 {
	static from(v: Xy | XyArray) {
		return Array.isArray(v)
			? new this(...v)
			: new this(v.x, v.y)
	}

	addZ(z = 0) {
		return new Worldspace3(this.x, this.y, z)
	}
}

export class Worldspace3 extends Vec3 {
	static from(v: Xyz | XyzArray) {
		return Array.isArray(v)
			? new this(...v)
			: new this(v.x, v.y, v.z)
	}

	static fromBabylon(v: Xyz) {
		return new this(v.x, v.z, v.y)
	}

	toBabylon(): BabVec3 {
		const {x, y, z} = this
		return {x, y: z, z: y}
	}

	/** given that this worldspace is a normal, calculate the steepness */
	slope() {
		return Math.acos(clamp(this.z, 0, 1)) / (Math.PI / 2)
	}
}

