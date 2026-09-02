
import {isMesh} from "../is.js"
import {Prop} from "../types.js"
import {flatten} from "./flatten.js"

/** get an array of all the meshes under this prop (including this prop if it's a mesh too) */
export function getMeshes(prop: Prop) {
	return flatten(prop).filter(isMesh)
}

