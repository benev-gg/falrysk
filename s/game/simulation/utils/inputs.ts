
import {guarantee} from "@e280/stz"
import {Intent, makeActionsResolver} from "@benev/tact"
import {bindings} from "../parts/bindings.js"
import {GameActions, GameActionsResolver, PlayerId, PlayerIntent} from "../types.js"

export class Inputs {
	activePlayers = new Set<PlayerId>()
	resolvers = new Map<PlayerId, GameActionsResolver>()

	ingest(actions: Map<PlayerId, GameActions>, playerIntents: PlayerIntent[]) {
		this.activePlayers.clear()

		// resolve actions for each player
		for (const [playerId, intents] of playerIntents) {
			this.activePlayers.add(playerId)
			const resolveActions = guarantee(this.resolvers, playerId, () => makeActionsResolver(bindings))
			resolveActions(intents)
		}

		// remove actions for obsolete players
		for (const playerId of actions.keys()) {
			if (!this.activePlayers.has(playerId))
				actions.delete(playerId)
		}
	}
}

