
import {ev} from "@e280/stz"
import {Vec2} from "@benev/math"
import {EntitiesReadonly} from "@benev/archimedes"

import {Venue} from "./parts/venue.js"
import {Timing} from "../tools/timing.js"
import {PlayerId} from "../game/types.js"
import {GameComponents} from "../game/parts/components.js"

export class Realm {
	venue
	entities
	playerId

	pointer = new Vec2()
	timing = new Timing(10, 240)

	#stopPointerListening

	constructor(options: {
			venue: Venue
			entities: EntitiesReadonly<GameComponents>
			playerId: PlayerId
		}) {

		const {canvas} = options.venue

		this.venue = options.venue
		this.entities = options.entities
		this.playerId = options.playerId

		this.#stopPointerListening = ev(canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				const {width, height} = canvas.getBoundingClientRect()
				this.pointer.x = clientX / width
				this.pointer.y = clientY / height
			},
		})
	}

	dispose() {
		this.#stopPointerListening()
	}
}

