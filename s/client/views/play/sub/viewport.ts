
import {html} from "lit"
import {light, useSignal} from "@e280/sly"
import {Projector} from "../../../parts/director/types.js"
import {useResizeObserver} from "../../../../lib/web/use-resize-observer.js"

export const Viewport = light((projector: Projector) => {
	const $resolution = useSignal(1)
	const {canvas} = projector

	useResizeObserver(canvas, rect => {
		const scale = $resolution() * window.devicePixelRatio
		const width = Math.floor(rect.width * scale) || 10
		const height = Math.floor(rect.height * scale) || 10
		projector.renderer.remote.setRenderSize(width, height)
	})

	function lock(event: PointerEvent) {
		if (document.pointerLockElement === null) {
			const cockpit = event.currentTarget as HTMLElement
			cockpit.requestPointerLock()
		}
	}

	return html`
		<div class=cockpit @click="${lock}">
			${canvas}
		</div>
	`
})

