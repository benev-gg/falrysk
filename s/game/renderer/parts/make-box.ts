
import {createBox, EngineContext, Material} from "@babylonjs/lite"

export function makeBox(engine: EngineContext, material: Material, size: number) {
	const box = createBox(engine, {size})
	box.material = material
	return box
}

