
import {guarantee} from "@e280/stz"
import {makeActionsResolver} from "@benev/tact"

import {PlayerId} from "../types.js"
import {bindings} from "../parts/bindings.js"

export class Actor {
	readonly actions

	constructor(
			public resolveActions: ReturnType<typeof makeActionsResolver<typeof bindings>>,
		) {
		this.actions = resolveActions([])
	}
}

export class ActorMap extends Map<PlayerId, Actor> {
	getActor(playerId: PlayerId) {
		return guarantee(this, playerId, () => {
			const resolveActions = makeActionsResolver(bindings)
			return new Actor(resolveActions)
		})
	}
}

