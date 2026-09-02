
import {Tuple3} from "@benev/math"
import {createMeshFromData, EngineContext, IWorldMatrixProvider, Mesh} from "@babylonjs/lite"
import {superclone} from "../superclone.js"
import {meshData} from "../utils/mesh-data.js"
import {defaultNameFn} from "./default-name-fn.js"

export function supercloneMesh(
		engine: EngineContext,
		mesh: Mesh,
		newParent: IWorldMatrixProvider | null = mesh.parent,
		nameFn = defaultNameFn,
	) {

	const data = meshData(mesh)

	// clone mesh data
	const fresh = createMeshFromData(
		engine,
		nameFn(mesh),
		data.positions.slice(),
		data.normals.slice(),
		data.indices.slice(),
		data.uvs?.slice() ?? undefined,
		data.uv2s?.slice() ?? undefined,
		data.tangents?.slice() ?? undefined,
		data.colors?.slice() ?? undefined,
	)

	// clone spatial data
	fresh.position.copyFrom(mesh.position)
	fresh.rotationQuaternion.copyFrom(mesh.rotationQuaternion)
	fresh.scaling.copyFrom(mesh.scaling)

	// maintain same material reference
	fresh.material = mesh.material

	// clone various data
	fresh.receiveShadows = mesh.receiveShadows
	fresh.boundMin = mesh.boundMin?.slice() as Tuple3
	fresh.boundMax = mesh.boundMax?.slice() as Tuple3
	fresh.pickable = mesh.pickable
	fresh.renderOrder = mesh.renderOrder
	fresh.renderOnTop = mesh.renderOnTop

	// explicit parent
	fresh.parent = newParent

	// superclone children recursively
	fresh.children = mesh.children.map(child => superclone(engine, child, fresh, nameFn))

	return fresh
}

