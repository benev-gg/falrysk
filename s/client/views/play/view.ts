
import {html} from "lit"
import {got} from "@e280/stz"
import {repeat} from "lit/directives/repeat.js"
import {shadow, useCss, useUnmount} from "@e280/sly"

import styleCss from "./style.css.js"
import {Seatview} from "./sub/seatview.js"
import {themeCss} from "../../../lib/web/theme.js"
import {Director} from "../../parts/director/types.js"

export const Play = (director: Director) => shadow(() => {
	useCss(themeCss, styleCss)
	useUnmount(() => director.dispose())

	return html`
		<div class=shell>
			${repeat(
				director.seats.keys(),
				playerId => playerId,
				playerId => Seatview(got(director.seats.get(playerId))),
			)}

			${director.seats.size === 0
				? html`<div class=noplayers>you need to connect a player port</div>`
				: null}
		</div>
	`
})

