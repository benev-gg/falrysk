
import {EntitiesReadonly} from "@benev/archimedes"

import {Seats} from "../types.js"
import {makeSeat} from "./make-seat.js"
import {LocalPlayers} from "../../inputs/local-players.js"

export function syncFreshSeats(
		players: LocalPlayers,
		seats: Seats,
		entities: EntitiesReadonly,
	) {

	for (const playerId of players.actions.keys()) {
		if (!seats.has(playerId))
			seats.set(playerId, makeSeat(playerId, entities))
	}
}

