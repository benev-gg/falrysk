
import {html} from "lit"
import {dom} from "@e280/sly"
import {DeskView} from "@benev/tact/ui"
import {Loader, setupBenev} from "@benev/web"

import {Satchel} from "../lib/web/satchel.js"
import {RenderZone} from "../lib/web/render-zone.js"
import {setupNavigation} from "./parts/navigation.js"
import {setupDeck} from "./parts/inputs/setup-deck.js"

const benev = await setupBenev()
dom.register(benev.elements)

const satchel = new Satchel("falrysk")
const {deck, getControllerLabel} = setupDeck(satchel.kv.cell("deck"))

const benevMenu = new RenderZone(dom("benev-menu"))
const benevHeader = new RenderZone(dom("benev-header"))
const benevLoader = new Loader(dom("benev-loader"))

benevMenu.render(html`
	<benev-account></benev-account>
	${DeskView(deck, {getControllerLabel})}
`)

setupNavigation({
	benevMenu,
	benevHeader,
	benevLoader,
	deck,
	getControllerLabel,
})

