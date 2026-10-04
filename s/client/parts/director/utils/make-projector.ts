
import {disposer} from "@e280/stz"
import {connectWorker} from "@e280/renraku/web"
import {EntitiesReadonly} from "@benev/archimedes"

import {consts} from "../../../../consts.js"
import {getVersion} from "../../get-version.js"
import {OnChanges, Projector} from "../types.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {RendererFns} from "../../../../game/renderer/types.js"

export async function makeProjector(
		playerId: PlayerId,
		catalog: Catalog,
		entities: EntitiesReadonly,
		onChanges: OnChanges,
	): Promise<Projector> {

	const dispose = disposer()
	const canvas = document.createElement("canvas")

	const url = new URL(consts.workers.render, import.meta.url)
	url.searchParams.set("v", getVersion())

	const worker = new Worker(url, {type: "module"})

	const renderer = await connectWorker<RendererFns>({
		worker,
		connectTimeout: 5_000,
		exposeAllErrors: true,
	})

	dispose.schedule(() => renderer.dispose())
	dispose.schedule(onChanges(changes => renderer.remote.applyChanges(changes)))

	try {
		await renderer.remote.initialize({
			playerId,
			catalog,
			entitiesSnapshot: entities.save(),
			canvas: canvas.transferControlToOffscreen(),
			dimensions: [200, 100],
		})
	}
	catch (error) {
		dispose()
		throw error
	}

	return {playerId, renderer, canvas, dispose}
}

