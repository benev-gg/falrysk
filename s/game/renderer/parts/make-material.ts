
import {createStandardMaterial} from "@babylonjs/lite"

export function makeMaterial(r: number, g: number, b: number, a?: number) {
	const material = createStandardMaterial()
	material.diffuseColor = [r, g, b]
	if (a) material.alpha = a
	return material
}

