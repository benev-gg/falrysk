
import {html} from "lit"
import {dom} from "@e280/sly"
import {once} from "@e280/stz"
import {Loader, setupBenev} from "@benev/web"

import {Basis} from "./types.js"
import {setupDeck} from "./parts/setup-deck.js"
import {RenderZone} from "./parts/render-zone.js"
import {setupNavigation} from "./parts/navigation.js"

const benev = await setupBenev()
dom.register(benev.elements)

const benevMenu = new RenderZone(dom("benev-menu"))
const benevHeader = new RenderZone(dom("benev-header"))
const benevLoader = new Loader(dom("benev-loader"))

const deckSetup = setupDeck()

benevMenu.render(html`
	<benev-account></benev-account>
	${deckSetup.renderDesk()}
`)

setupNavigation({
	menu: benevMenu,
	header: benevHeader,
	loader: benevLoader,
	getBasis: once(async() => (<Basis>{
		deckSetup,
		benevMenu,
		benevHeader,
	})),
})

