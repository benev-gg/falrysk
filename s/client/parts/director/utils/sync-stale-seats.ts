
import {Seats} from "../types.js"
import {LocalPlayers} from "../../inputs/local-players.js"

export function syncStaleSeats(
		players: LocalPlayers,
		seats: Seats,
	) {

	for (const [playerId, seat] of seats) {
		if (!players.actions.has(playerId)) {
			seat.dispose()
			seats.delete(playerId)
		}
	}
}

