
import {html} from "lit"
import {got} from "@e280/stz"
import {shadow, useCss} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import styleCss from "./style.css.js"
import {Seatview} from "./sub/seatview.js"
import {Director} from "../../parts/director.js"
import {themeCss} from "../../../lib/web/theme.js"

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

