
import {XyArray} from "@benev/math"
import {Catalog} from "./catalog.js"
import {PlayerId} from "../simulation/types.js"

export type RendererFns = {
	initialize(options: {
		playerId: PlayerId
		catalog: Catalog
		canvas: OffscreenCanvas
		entitiesSnapshot: Uint8Array
		dimensions: XyArray
	}): Promise<void>

	setRenderSize(x: number, y: number): Promise<void>
}

