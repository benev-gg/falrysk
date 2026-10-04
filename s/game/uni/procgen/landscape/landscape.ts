
import {clamp, invert, lerp, remap, smoothly, Vec4} from "@benev/math"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {lsMountains} from "./ls/mountains.js"
import {lsBigWarp, lsSmallWarp} from "./ls/warps.js"
import {Coordinates} from "../../units/coordinates.js"
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

	const wBigWarp = Coordinates.zero()
	const wFullWarp = Coordinates.zero()

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

	const highlandSpline = [0, 0.5, 1]

	function sample(wOriginal: Coordinates, output: SampleOutput) {
		wFullWarp.set(wOriginal)
		lsSmallWarp(tools, wFullWarp, 0.5)
		lsBigWarp(tools, wFullWarp, 0.7)
		lsSmallWarp(tools, wFullWarp, 0.5)

		const bedrock = tools.radialGradient(wFullWarp)

		if (bedrock < sealevel) {
			output.elevation =
				shorelift +
				lsBathymetry(tools, bedrock, sealevel, seafloor - shorelift)

			output.color.set_(1, 1, 1, 1)
			return
		}

		const relief = lsRelief(tools, wOriginal)
		const land = lsLand(tools, bedrock, sealevel)
		const landform = lsLandform(tools, wOriginal, land)

		const basement =
			shorelift +
			lerp(relief, basementHeight / 10, basementHeight) * landform

		const highlands = tools.sample(wOriginal, 30_000)
		highlandSpline[1] = remap(highlands, .1, .9)
		const mountainous = smoothly(clamp(relief * land), highlandSpline)

		const mountains = mountainous === 0
			? 0
			: mountainHeight * mountainous * (
				lsMountains(tools, lsBigWarp(tools, wBigWarp.set(wOriginal), .7), wOriginal)
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

