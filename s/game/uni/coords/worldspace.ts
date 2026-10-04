
import {clamp, Vec2, Vec3, Xyz} from "@benev/math"

export class Worldspace2 extends Vec2 {
	addZ(z = 0) {
		return new Worldspace3(this.x, this.y, z)
	}
}

export class Worldspace3 extends Vec3 {
	static fromBabylon(v: Xyz) {
		return new this(v.x, v.z, v.y)
	}

	babylonify() {
		const {y, z} = this
		this.y = z
		this.z = y
		return this
	}

	unbabylonify() {
		return this.babylonify() // reversible
	}

	/** given that this worldspace is a normal, calculate the steepness */
	slope() {
		return Math.acos(clamp(this.z, 0, 1)) / (Math.PI / 2)
	}
}

