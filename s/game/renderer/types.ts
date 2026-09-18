
import {XyArray} from "@benev/math"
import {Id} from "@benev/archimedes"
import {PlayerId} from "../simulation/types.js"
import {GameComponents} from "../simulation/parts/components.js"
import { Catalog } from "./catalog.js"

export type RenderWorkerFns = {
	initialize(options: {
		playerId: PlayerId
		catalog: Catalog
		canvas: OffscreenCanvas
		entities: [id: Id, components: Partial<GameComponents>][]
		dimensions: XyArray
	}): Promise<void>

	setRenderSize(x: number, y: number): Promise<void>
}

