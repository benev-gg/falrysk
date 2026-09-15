
import {Actions} from "@benev/tact"
import {light, spinner, useWait} from "@e280/sly"
import {EntitiesReadonly} from "@benev/archimedes"

import {Viewport} from "./viewport.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {setupVenue} from "../../../../game/renderer/venue.js"
import {bindings} from "../../../../game/simulation/parts/bindings.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export const Viewsplit = light((options: {
		playerId: PlayerId
		catalog: Catalog
		entities: EntitiesReadonly<GameComponents>
		getActions: () => Actions<typeof bindings>
	}) => {
	
	const $wait = useWait(
		async() => setupVenue(options),
		venue => venue.dispose(),
	)

	return spinner($wait(), venue => Viewport({...options, venue}))
})

