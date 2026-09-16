
import {gotOk} from "@e280/stz"
import {signal, wait} from "@e280/strata"
import {EntitiesReadonly} from "@benev/archimedes"

import {makeProjector} from "./make-projector.js"
import {LocalPlayers} from "../../inputs/local-players.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export function makeSeat(
		playerId: PlayerId,
		players: LocalPlayers,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog,
	) {

	const $waiter = signal(wait(makeProjector(playerId, players, entities, catalog)))

	const dispose = async() => {
		const result = await $waiter().result
		if (result.ok) return result.value.dispose()
	}

	const rebuild = async(catalog: Catalog) => {
		dispose()
		const w = wait(makeProjector(playerId, players, entities, catalog))
		$waiter(w)
		gotOk(await w.result)
	}

	return {playerId, $waiter, rebuild, dispose}
}

