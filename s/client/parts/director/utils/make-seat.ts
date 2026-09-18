
import {signal, wait} from "@e280/strata"
import {EntitiesReadonly} from "@benev/archimedes"

import {makeProjector} from "./make-projector.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export function makeSeat(
		playerId: PlayerId,
		entities: EntitiesReadonly<GameComponents>,
	) {

	const $wait = signal(wait(makeProjector(playerId, entities)))

	const dispose = async() => {
		const result = await $wait().result
		if (result.ok) return result.value.worker.dispose()
	}

	return {playerId, $wait, dispose}
}

