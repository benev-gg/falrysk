
import {html} from "lit"
import {loot, shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"

import {Basis} from "../../types.js"
import styleCss from "./style.css.js"
import {consts} from "../../../consts.js"
import {themeCss} from "../../../lib/web/theme.js"
import {smartCycle} from "../../../lib/tools/smart-cycle.js"
import {LocalPlayers} from "../../parts/inputs/local-players.js"
import {Simulation} from "../../../game/simulation/simulation.js"

export const Play = shadow((basis: Basis) => {
	useCss(themeCss, styleCss)

	const players = useOnce(() => new LocalPlayers())
	const simulation = useOnce(() => new Simulation())
	const playing = useSignal(true)

	useMount(() => smartCycle(consts.simulationHz.max, 3, async() => {
		if (!playing()) return
		const actions = players.update(performance.now(), basis.deck.ports)
		simulation.simulate(actions)
	}))

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

