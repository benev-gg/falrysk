
import {dom} from "@e280/sly"

import {Basis} from "../types.js"
import {Play} from "../views/play/view.js"

export default async function(_basis: Basis) {
	dom.register({GamePlay: Play()}, {soft: true})
}

