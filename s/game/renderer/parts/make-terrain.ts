
import {count2d} from "@e280/stz"
import {Rect, Vec2} from "@benev/math"
import {makeId} from "@benev/archimedes"
import {createMeshFromData, EngineContext, Material} from "@babylonjs/lite"

import {Oracle} from "../../uni/procgen/oracle.js"
import {Worldspace2} from "../../uni/coords/worldspace.js"

export function makeTerrain(options: {
		engine: EngineContext
		material: Material
		rect: Rect
		oracle: Oracle
		resolution: Vec2
	}) {

	const {engine, material, rect, oracle, resolution} = options

	// vertices
	const vertexCount = resolution.x * resolution.y
	const positions = new Float32Array(vertexCount * 3)
	const normals = new Float32Array(vertexCount * 3)
	{
		let index = 0
		for (const [column, row] of count2d(resolution.array())) {
			const i = index++
			const offset = i * 3

			const coord = Worldspace2
				.new(column, row)
				.div(resolution.dup().sub_(1, 1))
				.mul(rect.size())
				.add(rect.min)

			const position = coord
				.addZ(oracle.elevation(coord))
				.toBabylon()

			const normal = oracle
				.normal(coord)
				.toBabylon()

			positions.set([position.x, position.y, position.z], offset)
			normals.set([normal.x, normal.y, normal.z], offset)
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
	return mesh
}

