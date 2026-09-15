
import {Vec2} from "@benev/math"
import {disposer, ev} from "@e280/stz"
import {EntitiesReadonly} from "@benev/archimedes"
import {addToScene, createBox, createHemisphericLight, createStandardMaterial, EngineContext, registerScene, SceneContext} from "@babylonjs/lite"

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

		scene.clearColor = {r: 0, b: 0, g: 0, a: 1}
		const light = createHemisphericLight([.123, 1, .234], 1)
		addToScene(scene, light)

		scene.camera = this.gimbal.camera

		const material = createStandardMaterial()
		material.diffuseColor = [.8, .5, 0]

		const box = createBox(engine, {size: 1})
		box.material = material
		addToScene(scene, box)

		registerScene(scene)

		this.dispose.schedule(ev(canvas, {
			pointermove: ({clientX, clientY}: PointerEvent) => {
				const {width, height} = canvas.getBoundingClientRect()
				this.pointer.x = clientX / width
				this.pointer.y = clientY / height
			},
		}))
	}
}

