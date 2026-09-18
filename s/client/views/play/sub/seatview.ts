
import {html} from "lit"
import {earthSpinner, light, loot, useOnce} from "@e280/sly"

import {Viewport} from "./viewport.js"
import {Seat} from "../../../parts/director/types.js"

export const Seatview = light((seat: Seat) => {
	const drops = useOnce(() => new loot.Drops({
		predicate: loot.hasFiles,
		acceptDrop: async event => {
			const [file] = loot.files(event)
			const artGlb = await file.arrayBuffer()
			await seat.rebuild({artGlb})
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

			${earthSpinner(seat.$wait()(), projector => Viewport(projector))}
		</div>
	`
})

