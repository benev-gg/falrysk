
import {count2d} from "@e280/stz"
import {makeId} from "@benev/archimedes"
import {Rect, Vec2, XyzArray, XyzwArray} from "@benev/math"
import {createMeshFromData, EngineContext, Material} from "@babylonjs/lite"

import {Position} from "../../uni/units/position.js"
import {Coordinates} from "../../uni/units/coordinates.js"
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

	const landscapeSample = landscape.makeSampleOutput()

	const stats = {land: 0, highest: 0, lowest: 0}
	const vertexCount = resolution.x * resolution.y

	const size = landscape.getSize()
	const squareMeters = size.x * size.y
	const cellCount = resolution.x * resolution.y
	const cellArea = squareMeters / cellCount
	const resLessOne = resolution.dup().sub_(1, 1)

	// vertex positions and colors
	const positions = new Float32Array(vertexCount * 3)
	const colors = new Float32Array(vertexCount * 4)
	{
		const coord = new Coordinates()
		const position = new Position()
		const positionArray: XyzArray = [0, 0, 0]
		const colorArray: XyzwArray = [0, 0, 0, 1]

		let index = 0
		for (const [column, row] of count2d(resolution.array())) {
			const i = index++
			const positionOffset = i * 3
			const colorOffset = i * 4

			coord
				.set_(column, row)
				.div(resLessOne)
				.mul(rect.size())
				.add(rect.min)

			// perform sampling
			landscape.sample(coord, landscapeSample)

			const {elevation, color} = landscapeSample
			{
				if (elevation > 0) stats.land += cellArea
				if (elevation < stats.lowest) stats.lowest = elevation
				if (elevation > stats.highest) stats.highest = elevation
			}

			position
				.set_(coord.x, coord.y, elevation)
				.babylonify()

			positionArray[0] = position.x
			positionArray[1] = position.y
			positionArray[2] = position.z

			colorArray[0] = color.x
			colorArray[1] = color.y
			colorArray[2] = color.z
			colorArray[3] = color.w

			positions.set(positionArray, positionOffset)
			colors.set(colorArray, colorOffset)
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
		undefined, // uv
		undefined, // uv2
		undefined, // tangents
		colors,
	)

	mesh.material = material

	const landFraction = stats.land / squareMeters
	const landMeters2 = landFraction * squareMeters
	const landKm2 = landMeters2 / 1_000_000
	const worldKm2 = squareMeters / 1_000_000
	const oceanKm2 = worldKm2 - landKm2

	console.log(`makeTerrain ${(performance.now() - timeStart).toFixed(1)}ms`)
	console.log(` - land    ${landKm2.toFixed(0)}km²`)
	console.log(` - sea     ${oceanKm2.toFixed(0)}km²`)
	console.log(` - lowest  ${stats.lowest.toFixed(0)}m`)
	console.log(` - highest ${stats.highest.toFixed(0)}m`)

	return mesh
}

