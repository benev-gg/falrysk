
import {createStandardMaterial} from "@babylonjs/lite"

export function makeMaterial(r: number, g: number, b: number) {
	const material = createStandardMaterial()
	material.diffuseColor = [r, g, b]
	return material
}

