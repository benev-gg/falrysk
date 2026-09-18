
import {connectWorker} from "@e280/renraku/web"
import {EntitiesReadonly} from "@benev/archimedes"

import {consts} from "../../../../consts.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {RenderWorkerFns} from "../../../../game/renderer/types.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export async function makeProjector(
		playerId: PlayerId,
		entities: EntitiesReadonly<GameComponents>,
	) {

	const canvas = document.createElement("canvas")
	const url = new URL(consts.workers.render, import.meta.url)
	const worker = await connectWorker<RenderWorkerFns>(url)

	await worker.remote.initialize({
		playerId,
		entities: [...entities.entries()],
		canvas: canvas.transferControlToOffscreen(),
		dimensions: [200, 100],
	})

	return {playerId, worker, canvas}
}

