
import {gotOk} from "@e280/stz"
import {Seats} from "../types.js"

export async function allProjectorsReady(seats: Seats) {
	await Promise.all(
		[...seats.values()]
			.map(async seat => gotOk(await seat.$wait().result))
	)
}

