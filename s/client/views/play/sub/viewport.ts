
import {Actions} from "@benev/tact"
import {renderFrame, setEngineSize} from "@babylonjs/lite"
import {light, useMount, useMounted, useOnce, useSignal} from "@e280/sly"

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

	const realm = useMounted(() => {
		const realm = new Realm(venue)
		return [realm, () => realm.dispose()]
	})

	const $resolution = useSignal(1)
	const render = useOnce(() => setupRender(realm))

	useResizeObserver(canvas, rect => {
		const scale = $resolution() * window.devicePixelRatio
		const width = Math.floor(rect.width * scale) || 10
		const height = Math.floor(rect.height * scale) || 10
		setEngineSize(venue.engine, width, height)
	})

	useMount(() => rafloop(dt => {
		render()
		renderFrame(venue.engine, dt)
	}))

	return venue.canvas
})

