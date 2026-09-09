
import {html} from "lit"
import {loot, shadow, useCss, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {themeCss} from "../../../lib/web/theme.js"
// import {Game} from "../../../game/simulation/game.js"

export const Play = shadow(() => {
	useCss(themeCss, styleCss)

	// const game = useOnce(() => new Game())

	const drops = useOnce(() => new loot.Drops({
		predicate: loot.hasFiles,
		acceptDrop: async event => {
			const [file] = loot.files(event)
			console.log("dropped file", file.name)
			// const buffer = await file.arrayBuffer()
		},
	}))

	return html`
		<div
			class=shell
			?data-drop=${drops.$indicator()}
			@dragover=${drops.dragover}
			@dragleave=${drops.dragleave}
			@drop=${drops.drop}>

			<div class=coming-soon>coming soon lol</div>
		</div>
	`
})

