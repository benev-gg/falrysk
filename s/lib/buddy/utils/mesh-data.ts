
import {Mesh} from "@babylonjs/lite"

/** grab the buffers from a mesh */
export function meshData(mesh: Mesh) {
	const m = mesh as MeshCpu
	return {
		positions: m._cpuPositions,
		normals: m._cpuNormals,
		indices: m._cpuIndices,
		uvs: m._cpuUvs,
		uv2s: m._cpuUv2s,
		tangents: m._cpuTangents,
		colors: m._cpuColors,
	}
}

type MeshCpu = Mesh & {
	_cpuPositions: Float32Array
	_cpuNormals: Float32Array
	_cpuIndices: Uint32Array
	_cpuUvs?: Float32Array
	_cpuUv2s?: Float32Array
	_cpuTangents?: Float32Array
	_cpuColors?: Float32Array
}

