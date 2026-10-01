
import {Vec4} from "@benev/math"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {Worldspace2} from "../../coords/worldspace.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const timeStart = performance.now()
	const tools = new LandscapeTools(params)
	const debugColor = new Vec4(1, 1, 1, 1)

	function getElevation(w: Worldspace2) {
		return 1
	}

	function getDebugColor(w: Worldspace2) {
		return debugColor.set_(1, 0, 0, 1)
	}

	console.log(`makeLandscape ${(performance.now() - timeStart).toFixed(1)}ms`)

	return {
		getElevation,
		getDebugColor,
		getSize: () => params.size.dup(),
	}
}

