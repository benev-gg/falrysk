import {html} from "lit"
import {light, loot, spinner, useOnce} from "@e280/sly"

import {Viewport} from "./viewport.js"
import {Seat} from "../../../parts/director.js"
import {Catalog} from "../../../../game/renderer/catalog.js"

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

			${spinner(seat.$waiter()(), projector => Viewport(projector.realm))}
		</div>
	`
})

