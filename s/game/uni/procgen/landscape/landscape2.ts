
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {Worldspace2} from "../../coords/worldspace.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const timeStart = performance.now()
	const tools = new LandscapeTools(params)

	function getElevation(w: Worldspace2) {
		return 1
	}

	console.log(`makeLandscape ${(performance.now() - timeStart).toFixed(1)}ms`)

	return {
		getElevation,
		getSize: () => params.size.dup(),
	}
}

