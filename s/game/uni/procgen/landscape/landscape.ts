
import {pipe} from "@e280/stz"
import {clamp, lerp, Vec4} from "@benev/math"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {lsMountains} from "./ls/mountains.js"
import {lsBigWarp, lsSmallWarp} from "./ls/warps.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeRand} from "../../../../lib/tools/rand.js"
import {lsBathymetry, lsLand, lsLandform, lsRelief} from "./ls/landform.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const debugColor = new Vec4(1, 1, 1, 1)
	const tools = new LandscapeTools(params)

	const rand = makeRand("landscape.rand", params.seed)
	const shorelift = 10 // meters
	const seafloor = -1000 // meters
	const basementHeight = 2000 // meters
	const mountainHeight = 2000 // meters

	const sealevel = rand.range(.3, .6) // noul along bedrock gradient

	function getElevation(w: Worldspace2) {
		const fullWarp = pipe(w)
			.to(w => lsSmallWarp(tools, w, .5))
			.to(w => lsBigWarp(tools, w, .7))
			.to(w => lsSmallWarp(tools, w, .5))
			.done()

		const bedrock = tools.radialGradient(fullWarp)
		const relief = lsRelief(tools, w)
		const reliefHeight = lerp(relief, basementHeight / 10, basementHeight)
		const land = lsLand(tools, bedrock, sealevel)
		const landform = lsLandform(tools, w, land)

		const basement = shorelift + (
			(bedrock < sealevel)
				? lsBathymetry(tools, bedrock, sealevel, seafloor - shorelift)
				: reliefHeight * landform
		)

		const mountainous = clamp(relief * land) ** 2
		const bigWarp = lsBigWarp(tools, w, .7)

		const mountains = mountainous * (
			(mountainous === 0)
				? 0
				: mountainHeight * lsMountains(tools, bigWarp, w)
		)

		return basement + mountains
	}

	function getDebugColor(w: Worldspace2) {
		return debugColor.set_(1, 1, 1, 1)

		// const relief = lsRelief(tools, w)
		// const x = invert(relief)
		// return debugColor.set_(1, x, x, 1)

		// const bedrock = lsBedrock(tools, w)
		// const relief = lsRelief(tools, w)
		// const land = lsLand(tools, bedrock, sealevel)
		// const landform = lsLandform(tools, w, land)
		// const mountainous = relief * landform
		// const x = invert(mountainous)
		// return debugColor.set_(1, x, x, 1)
	}

	return {
		getElevation,
		getDebugColor,
		getSize: () => params.size.dup(),
	}
}

