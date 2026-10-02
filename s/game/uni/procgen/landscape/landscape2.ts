
import {invert, lerp, Vec4} from "@benev/math"
import {lsBedrock} from "./ls/bedrock.js"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {lsMountains} from "./ls/mountains.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeRand} from "../../../../lib/tools/rand.js"
import {lsBathymetry, lsLand, lsLandform, lsRelief} from "./ls/landform.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const timeStart = performance.now()
	const debugColor = new Vec4(1, 1, 1, 1)
	const tools = new LandscapeTools(params)

	const rand = makeRand("landscape.rand", params.seed)
	const shorelift = 1 // meters
	const seafloor = -500 // meters
	const basementHeight = 500 // meters
	const mountainHeight = 2500 // meters

	const sealevel = rand.range(.3, .6) // noul along bedrock gradient

	function getElevation(w: Worldspace2) {
		const bedrock = lsBedrock(tools, w)
		const relief = lsRelief(tools, w)
		const reliefHeight = lerp(relief, basementHeight / 10, basementHeight)
		const land = lsLand(tools, bedrock, sealevel)
		const landform = lsLandform(tools, w, land)

		const basement = shorelift + (
			(bedrock < sealevel)
				? lsBathymetry(tools, bedrock, sealevel, seafloor)
				: reliefHeight * landform
		)

		const mountainous = relief * landform
		const mountains = mountainHeight * lsMountains(tools, w, mountainous)

		return basement + mountains
	}

	function getDebugColor(w: Worldspace2) {
		const bedrock = lsBedrock(tools, w)
		const relief = lsRelief(tools, w)
		const mountainous = relief * bedrock
		const x = invert(mountainous)
		return debugColor.set_(1, x, x, 1)
	}

	console.log(`makeLandscape ${(performance.now() - timeStart).toFixed(1)}ms`)

	return {
		getElevation,
		getDebugColor,
		getSize: () => params.size.dup(),
	}
}

