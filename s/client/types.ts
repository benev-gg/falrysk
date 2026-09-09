
import {Loader} from "@benev/web"
import {Content} from "@e280/sly"
import {Controller, Deck} from "@benev/tact"
import {RenderZone} from "../lib/web/render-zone.js"

export type Basis = {
	benevMenu: RenderZone
	benevHeader: RenderZone
	benevLoader: Loader
	deck: Deck
	getControllerLabel: (controller: Controller) => Content
}

