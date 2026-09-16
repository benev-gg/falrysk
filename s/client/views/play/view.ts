
import {html} from "lit"
import {signal} from "@e280/strata"
import {got} from "@e280/stz"
import {keyed} from "lit/directives/keyed.js"
import {repeat} from "lit/directives/repeat.js"
import {loot, shadow, useCss, useMount, useOnce, useSignal} from "@e280/sly"

import {Basis} from "../../types.js"
import styleCss from "./style.css.js"
import {consts} from "../../../consts.js"
import {Viewsplit} from "./sub/viewsplit.js"
import {Director} from "../../parts/director.js"
import {themeCss} from "../../../lib/web/theme.js"
import {Catalog} from "../../../game/renderer/catalog.js"
import {smartCycle} from "../../../lib/tools/smart-cycle.js"
import {LocalPlayers} from "../../parts/inputs/local-players.js"
import {Simulation} from "../../../game/simulation/simulation.js"

export const Play = (basis: Basis, director: Director) => shadow(() => {
	useCss(themeCss, styleCss)

	const $playing = useSignal(true)
	const $catalog = useOnce(() => signal(new Catalog()))

	const players = useOnce(() => new LocalPlayers())
	const simulation = useOnce(() => new Simulation())

	useMount(() => smartCycle(consts.simulationHz.max, 3, async() => {
		if (!$playing()) return
		const actions = players.update(performance.now(), basis.deck.ports)
		simulation.simulate(actions)
	}))

	const drops = useOnce(() => new loot.Drops({
		predicate: loot.hasFiles,
		acceptDrop: async event => {
			const [file] = loot.files(event)
			console.log("dropped file", file.name)

			// sooner or later we'll put the dropped glb into the catalog, and use it
			$catalog(new Catalog())
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

			${keyed($catalog(), repeat(
				players.actions.keys(),
				playerId => playerId,
				playerId => Viewsplit({
					playerId,
					catalog: $catalog(),
					entities: simulation.entities,
					getActions: () => got(players.actions.get(playerId)),
				}),
			))}

			${players.actions.size === 0
				? html`<div class=no-players>no player port!</div>`
				: null}
		</div>
	`
})

