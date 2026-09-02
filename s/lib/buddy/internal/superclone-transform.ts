
import {createTransformNode, EngineContext, IWorldMatrixProvider, TransformNode} from "@babylonjs/lite"
import {superclone} from "../superclone.js"
import {defaultNameFn} from "./default-name-fn.js"

export function supercloneTransform(
		engine: EngineContext,
		transform: TransformNode,
		newParent: IWorldMatrixProvider | null = transform.parent,
		nameFn = defaultNameFn,
	): TransformNode {

	const {position: p, rotationQuaternion: r, scaling: s} = transform

	// clone transform with spatial data
	const fresh = createTransformNode(
		nameFn(transform),
		p.x, p.y, p.z,
		r.x, r.y, r.z, r.w,
		s.x, s.y, s.z,
	)

	// explicit parent
	fresh.parent = newParent

	// superclone children recursively
	fresh.children = transform.children.map(child => superclone(engine, child, fresh, nameFn))

	return fresh
}

