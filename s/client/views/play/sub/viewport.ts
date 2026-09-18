
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
		projector.worker.remote.setRenderSize(width, height)
	})

	return canvas
})

