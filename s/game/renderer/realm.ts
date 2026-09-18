
import {Vec2} from "@benev/math"
import {disposer} from "@e280/stz"

import {Venue} from "./venue.js"
import {Gimbal} from "./parts/gimbal.js"
import {RenderClock} from "./parts/render-clock.js"

export class Realm {
	gimbal = new Gimbal()
	pointer = new Vec2()
	clock = new RenderClock()
	dispose = disposer()
	constructor(public venue: Venue) {}
}

