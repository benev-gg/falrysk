
import {Vec2} from "@benev/math"
import {disposer, ev} from "@e280/stz"
import {EntitiesReadonly} from "@benev/archimedes"
import {addToScene, createBox, createHemisphericLight, EngineContext, SceneContext} from "@babylonjs/lite"

import {Gimbal} from "./parts/gimbal.js"
import {PlayerId} from "../simulation/types.js"
import {Timing} from "../../lib/tools/timing.js"
import {GameComponents} from "../simulation/parts/components.js"

export class Realm {
	gimbal = new Gimbal()
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

		const {canvas, engine, scene} = venue

		const light = createHemisphericLight([.012, 1, .023], 1)
		addToScene(scene, light)

		this.gimbal.radius = 5
		scene.camera = this.gimbal.camera

		const box = createBox(engine, {size: 1})
		addToScene(scene, box)

		this.dispose.schedule(ev(canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				const {width, height} = canvas.getBoundingClientRect()
				this.pointer.x = clientX / width
				this.pointer.y = clientY / height
			},
		}))
	}
}

