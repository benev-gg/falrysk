
import {Vec2} from "@benev/math"
import {disposer, ev} from "@e280/stz"
import {EntitiesReadonly} from "@benev/archimedes"
import {addToScene, createHemisphericLight, EngineContext, SceneContext} from "@babylonjs/lite"

import {PlayerId} from "../simulation/types.js"
import {Timing} from "../../lib/tools/timing.js"
import {GameComponents} from "../simulation/parts/components.js"

export class Realm {
	pointer = new Vec2()
	timing = new Timing()
	dispose = disposer()

	constructor(public venue: {
			canvas: HTMLCanvasElement
			engine: EngineContext
			scene: SceneContext
			playerId: PlayerId
			entities: EntitiesReadonly<GameComponents>
		}) {

		const light = createHemisphericLight([.012, 1, .023], 1)
		addToScene(venue.scene, light)

		this.dispose.schedule(ev(venue.canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				const {width, height} = venue.canvas.getBoundingClientRect()
				this.pointer.x = clientX / width
				this.pointer.y = clientY / height
			},
		}))
	}
}

