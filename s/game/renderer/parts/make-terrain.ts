
import {count2d} from "@e280/stz"
import {Rect, Vec2} from "@benev/math"
import {makeId} from "@benev/archimedes"
import {createMeshFromData, EngineContext, Material} from "@babylonjs/lite"

import {Worldspace2} from "../../uni/coords/worldspace.js"
import {Landscape} from "../../uni/procgen/landscape/landscape.js"

export function makeTerrain(options: {
		engine: EngineContext
		material: Material
		rect: Rect
		landscape: Landscape
		resolution: Vec2
	}) {

	const timeStart = performance.now()
	const {engine, material, rect, landscape, resolution} = options

	const vertexCount = resolution.x * resolution.y

	// vertex position
	const positions = new Float32Array(vertexCount * 3)
	{
		const coord = new Worldspace2()

		let index = 0
		for (const [column, row] of count2d(resolution.array())) {
			const i = index++
			const offset = i * 3

			coord
				.set_(column, row)
				.div(resolution.dup().sub_(1, 1))
				.mul(rect.size())
				.add(rect.min)

			const position = coord
				.addZ(landscape.getElevation(coord))
				.toBabylon()

			positions.set([position.x, position.y, position.z], offset)
		}
	}

	// vertex normal
	const normals = new Float32Array(vertexCount * 3)
	{
		const width = resolution.x
		const height = resolution.y
		const size = rect.size()
		const stepX = size.x / (width - 1)
		const stepY = size.y / (height - 1)

		const elevation = (x: number, y: number) =>
			positions[(y * width + x) * 3 + 1]

		for (const [x, y] of count2d(resolution.array())) {
			const left = Math.max(0, x - 1)
			const right = Math.min(width - 1, x + 1)
			const below = Math.max(0, y - 1)
			const above = Math.min(height - 1, y + 1)

			const dx = (
				elevation(right, y) - elevation(left, y)
			) / ((right - left) * stepX)

			const dy = (
				elevation(x, above) - elevation(x, below)
			) / ((above - below) * stepY)

			const length = Math.hypot(dx, 1, dy)
			const offset = (y * width + x) * 3

			normals[offset] = -dx / length
			normals[offset + 1] = 1 / length
			normals[offset + 2] = -dy / length
		}
	}

	// triangles
	const quadCount = (resolution.x - 1) * (resolution.y - 1)
	const indices = new Uint32Array(quadCount * 6)
	{
		let index = 0
		for (let row = 0; row < resolution.y - 1; row++) {
			for (let column = 0; column < resolution.x - 1; column++) {
				const a = row * resolution.x + column
				const b = a + 1
				const c = a + resolution.x
				const d = c + 1

				indices[index++] = a
				indices[index++] = b
				indices[index++] = d

				indices[index++] = a
				indices[index++] = d
				indices[index++] = c
			}
		}
	}

	const mesh = createMeshFromData(
		engine,
		makeId(),
		positions,
		normals,
		indices,
	)

	mesh.material = material

	console.log(`makeTerrain ${(performance.now() - timeStart).toFixed(1)}ms`)
	return mesh
}

