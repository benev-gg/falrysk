
import {EngineContext, IWorldMatrixProvider} from "@babylonjs/lite"
import {isMesh} from "./is.js"
import {Prop} from "./types.js"
import {defaultNameFn} from "./internal/default-name-fn.js"
import {supercloneMesh} from "./internal/superclone-mesh.js"
import {supercloneTransform} from "./internal/superclone-transform.js"

/** hard-deep-clone of a prop hierarchy, even copying the mesh data buffers (but materials aren't copied, their old references are reused) */
export function superclone<N extends Prop>(
		engine: EngineContext,
		prop: N,
		newParent: IWorldMatrixProvider | null = prop.parent,
		nameFn = defaultNameFn,
	) {

	return isMesh(prop)
		? supercloneMesh(engine, prop, newParent, nameFn) as N
		: supercloneTransform(engine, prop, newParent, nameFn) as N
}

