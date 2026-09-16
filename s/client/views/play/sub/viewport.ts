
import {renderFrame} from "@babylonjs/lite"
import {light, useMount, useOnce, useSignal} from "@e280/sly"

import {rafloop} from "../../../../lib/web/rafloop.js"
import {Realm} from "../../../../game/renderer/realm.js"
import {setupRender} from "../../../../game/renderer/render.js"
import {useResizeObserver} from "../../../../lib/web/use-resize-observer.js"

export const Viewport = light((realm: Realm) => {
	const {venue} = realm
	const {canvas} = venue

	const $resolution = useSignal(1)
	const render = useOnce(() => setupRender(realm))

	useResizeObserver(canvas, rect => {
		const scale = $resolution() * window.devicePixelRatio
		const width = Math.floor(rect.width * scale) || 10
		const height = Math.floor(rect.height * scale) || 10
		venue.setRenderSize(width, height)
	})

	useMount(() => rafloop(dt => {
		render()
		renderFrame(venue.engine, dt)
	}))

	return venue.canvas
})

