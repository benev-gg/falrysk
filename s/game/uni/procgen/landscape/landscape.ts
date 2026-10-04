
import {clamp, invert, lerp, Vec4} from "@benev/math"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {lsMountains} from "./ls/mountains.js"
import {lsBigWarp, lsSmallWarp} from "./ls/warps.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeRand} from "../../../../lib/tools/rand.js"
import {lsBathymetry, lsLand, lsLandform, lsRelief} from "./ls/landform.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const tools = new LandscapeTools(params)

	const rand = makeRand("landscape.rand", params.seed)
	const shorelift = 10 // meters
	const seafloor = -1000 // meters
	const basementHeight = 1200 // meters
	const mountainHeight = 2800 // meters
	const sealevel = rand.range(.3, .6) // noul along bedrock gradient

	const wBigWarp = Worldspace2.zero()
	const wFullWarp = Worldspace2.zero()

	type SampleOutput = {
		elevation: number
		color: Vec4
	}

	function makeSampleOutput(): SampleOutput {
		return {
			elevation: 0,
			color: new Vec4(1, 1, 1, 1),
		}
	}

	function sample(wOriginal: Worldspace2, output: SampleOutput) {
		wBigWarp.set(wOriginal)
		lsBigWarp(tools, wBigWarp, .7)

		wFullWarp.set(wOriginal)
		lsSmallWarp(tools, wFullWarp, 0.5)
		lsBigWarp(tools, wFullWarp, 0.7)
		lsSmallWarp(tools, wFullWarp, 0.5)

		const bedrock = tools.radialGradient(wFullWarp)
		const relief = lsRelief(tools, wOriginal)
		const reliefHeight = lerp(relief, basementHeight / 10, basementHeight)
		const land = lsLand(tools, bedrock, sealevel)
		const landform = lsLandform(tools, wOriginal, land)

		const basement = shorelift + (
			(bedrock < sealevel)
				? lsBathymetry(tools, bedrock, sealevel, seafloor - shorelift)
				: reliefHeight * landform
		)

		const mountainous = clamp(relief * land) ** 2

		const mountains = mountainous * (
			(mountainous === 0)
				? 0
				: mountainHeight * lsMountains(tools, wBigWarp, wOriginal)
		)

		const x = invert(mountainous)
		output.elevation = basement + mountains
		output.color.set_(1, x, x, 1)
	}

	return {
		sample,
		makeSampleOutput,
		getSize: () => params.size.dup(),
	}
}

