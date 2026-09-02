
import {Mesh, TransformNode} from "@babylonjs/lite"
import {Entity, Light} from "./types.js"

export function isLight(entity: Entity): entity is Light {
	return ("lightType" in entity)
}

export function isMesh(entity: Entity): entity is Mesh {
	return !isLight(entity) && ("_cpuPositions" in entity)
}

export function isTransform(entity: Entity): entity is TransformNode {
	return !isLight(entity) && !isMesh(entity)
}

