
import {gotOk} from "@e280/stz"
import {signal, wait} from "@e280/strata"
import {EntitiesReadonly} from "@benev/archimedes"

import {Seat} from "../types.js"
import {makeProjector} from "./make-projector.js"
import {Catalog, makeCatalog} from "../../../../game/renderer/catalog.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export function makeSeat(
		playerId: PlayerId,
		entities: EntitiesReadonly<GameComponents>,
	): Seat {

	const mkProjector = async(overrideCatalog?: Catalog) => {
		const catalog = overrideCatalog ?? await makeCatalog()
		return makeProjector(playerId, catalog, entities)
	}

	const $wait = signal(wait(mkProjector()))

	const dispose = async() => {
		const result = await $wait().result
		if (result.ok) return result.value.dispose()
	}

	const rebuild = async(catalog: Catalog) => {
		dispose()
		const w = wait(mkProjector(catalog))
		$wait(w)
		gotOk(await w.result)
	}

	return {playerId, $wait, rebuild, dispose}
}

