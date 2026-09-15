
import {Actions} from "@benev/tact"
import {renderFrame} from "@babylonjs/lite"
import {light, useMount, useOnce, useSignal} from "@e280/sly"

import {rafloop} from "../../../../lib/web/rafloop.js"
import {Venue} from "../../../../game/renderer/venue.js"
import {Realm} from "../../../../game/renderer/realm.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {setupRender} from "../../../../game/renderer/render.js"
import {bindings} from "../../../../game/simulation/parts/bindings.js"
import {useResizeObserver} from "../../../../lib/web/use-resize-observer.js"

export const Viewport = light((options: {
		venue: Venue
		catalog: Catalog
		getActions: () => Actions<typeof bindings>
	}) => {

	const {venue} = options
	const {canvas} = venue

	const realm = useOnce(() => new Realm(venue))
	const render = useOnce(() => setupRender(realm))
	const $resolution = useSignal(0.5)

	useMount(() => () => {
		realm.dispose()
		venue.dispose()
	})

	useResizeObserver(canvas, rect => {
		canvas.width = Math.floor(rect.width * $resolution()) || 1
		canvas.height = Math.floor(rect.height * $resolution()) || 1
	})

	useMount(() => rafloop(dt => {
		render()
		renderFrame(venue.engine, dt)
	}))

	return venue.canvas
})

