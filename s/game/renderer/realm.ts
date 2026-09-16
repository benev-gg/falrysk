
import {Vec2} from "@benev/math"
import {disposer, ev} from "@e280/stz"

import {Venue} from "./venue.js"
import {Gimbal} from "./parts/gimbal.js"
import {Timing} from "../../lib/tools/timing.js"

export class Realm {
	gimbal = new Gimbal()
	pointer = new Vec2()
	timing = new Timing()
	dispose = disposer()

	constructor(public venue: Venue) {
		const {canvas} = venue

		this.dispose.schedule(ev(canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				const {width, height} = canvas.getBoundingClientRect()
				this.pointer.x = clientX / width
				this.pointer.y = clientY / height
			},
		}))
	}
}

