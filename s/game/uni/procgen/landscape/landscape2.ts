
import {hash32} from "@e280/stz"
import {clamp, invert, lerp, remap, smooth, Vec4} from "@benev/math"
import {LandscapeTools} from "./tools.js"
import {LandscapeParams} from "./types.js"
import {lsIslandness} from "./ls/islandness.js"
import {Worldspace2} from "../../coords/worldspace.js"
import {makeRand} from "../../../../lib/tools/rand.js"

export type Landscape = ReturnType<typeof makeLandscape>

export function makeLandscape(params: LandscapeParams) {
	const timeStart = performance.now()
	const debugColor = new Vec4(1, 1, 1, 1)
	const tools = new LandscapeTools(params)

	const rand = makeRand("landscape.rand", params.seed)
	const bedrockOffset = hash32("landscape.bedrock")
	const coastalOffset = hash32("landscape.coastal")

	const waterlevel = rand.range(.3, .6)
	const seafloor = 500
	const bedrockHeight = 500

	const sampleRelief = (w: Worldspace2) => (
		tools.sample(w, tools.percent(25), bedrockOffset)
	)

	const sampleCoastal = (w: Worldspace2) => (
		tools.sample(w, tools.percent(25), coastalOffset)
	)

	function getElevation(w: Worldspace2) {
		const islandness = lsIslandness(tools, w)
		const relief = lerp(sampleRelief(w), bedrockHeight / 10, bedrockHeight)
		const shorelift = 1

		if (islandness < waterlevel) {
			return shorelift + remap(islandness, 0, waterlevel, -seafloor, 0)
		}
		else {
			const land = remap(islandness, waterlevel, 1)
			const shaped = smooth(land, [
				0,
				lerp(sampleCoastal(w) ** 3, .1, .9),
				1,
			])
			return shorelift + (relief * shaped)
		}
	}

	function getDebugColor(w: Worldspace2) {
		return debugColor.set_(1, 1, 1, 1)

		// const coastal = sampleCoastal(w)
		// return debugColor.set_(1, invert(coastal), invert(coastal), 1)

		// const bedrock = sampleRelief(w)
		// return debugColor.set_(bedrock, invert(bedrock), 0, 1)
	}

	console.log(`makeLandscape ${(performance.now() - timeStart).toFixed(1)}ms`)

	return {
		getElevation,
		getDebugColor,
		getSize: () => params.size.dup(),
	}
}

