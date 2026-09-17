
import {createGround, EngineContext, Material} from "@babylonjs/lite"

export function makeSea(engine: EngineContext, material: Material, size: number) {
	const mesh = createGround(engine, {width: size, height: size, subdivisions: 2})
	mesh.material = material
	return mesh
}

