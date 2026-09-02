
import {Vec3} from "@benev/math"
import {EngineContext, Mesh, updateMeshColors} from "@babylonjs/lite"
import {meshData} from "./mesh-data.js"

/** manipulate a mesh's color buffer in-place, swapping `magicColor` for `newColor` (leaving other colors intact) */
export function meshRecolor(engine: EngineContext, mesh: Mesh, magicColor: Vec3, newColor: Vec3) {
	const {colors} = meshData(mesh)

	if (!colors)
		throw new Error("cannot recolor, this mesh does not support colors")

	for (let i = 0; i < colors.length; i += 4) {
		const r = colors[i + 0]
		const g = colors[i + 1]
		const b = colors[i + 2]

		const isMagicColor = (magicColor.x === r && magicColor.y === g && magicColor.z === b)
		if (isMagicColor) {
			colors[i + 0] = newColor.x
			colors[i + 1] = newColor.y
			colors[i + 2] = newColor.z
		}
	}

	updateMeshColors(engine, mesh, colors)
}

