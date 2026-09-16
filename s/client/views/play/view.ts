
import {html} from "lit"
import {got} from "@e280/stz"
import {repeat} from "lit/directives/repeat.js"
import {light, loot, shadow, spinner, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Director, Seat} from "../../parts/director.js"
import {themeCss} from "../../../lib/web/theme.js"
import {Catalog} from "../../../game/renderer/catalog.js"

export const Play = (director: Director) => shadow(() => {
	useCss(themeCss, styleCss)

	return html`
		<div class=shell>
			${repeat(
				director.seats.keys(),
				playerId => playerId,
				playerId => Seatview(got(director.seats.get(playerId))),
			)}

			${director.seats.size === 0
				? html`<div class=no-players>please add a player port</div>`
				: null}
		</div>
	`
})

export const Seatview = light((seat: Seat) => {
	const drops = useOnce(() => new loot.Drops({
		predicate: loot.hasFiles,
		acceptDrop: async event => {
			const [file] = loot.files(event)
			console.log("dropped file", file.name)
			// const buffer = await file.arrayBuffer()
			await seat.rebuild(new Catalog())
		},
	}))

	return html`
		<div
			class=seat
			data-player-id="${seat.playerId}"
			?data-drop=${drops.$indicator()}
			@dragover=${drops.dragover}
			@dragleave=${drops.dragleave}
			@drop=${drops.drop}>

			${spinner(seat.$waiter()(), projector => projector.realm.venue.canvas)}
		</div>
	`
})

