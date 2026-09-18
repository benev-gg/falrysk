
import {connectWorker} from "@e280/renraku/web"
import {EntitiesReadonly} from "@benev/archimedes"

import {Projector} from "../types.js"
import {consts} from "../../../../consts.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {RenderWorkerFns} from "../../../../game/renderer/types.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export async function makeProjector(
		playerId: PlayerId,
		catalog: Catalog,
		entities: EntitiesReadonly<GameComponents>,
	): Promise<Projector> {

	const canvas = document.createElement("canvas")
	const url = new URL(consts.workers.render, import.meta.url)
	const worker = await connectWorker<RenderWorkerFns>(url)
	const dispose = () => worker.dispose()

	try {
		await worker.remote.initialize({
			playerId,
			catalog,
			entities: [...entities.entries()],
			canvas: canvas.transferControlToOffscreen(),
			dimensions: [200, 100],
		})
	}
	catch (error) {
		dispose()
		throw error
	}

	return {playerId, worker, canvas, dispose}
}

