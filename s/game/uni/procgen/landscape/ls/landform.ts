
import {lerp, remap, smoothly} from "@benev/math"
import {LandscapeTools} from "../tools.js"
import {makeHasher} from "../utils/hasher.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const hasher = makeHasher("ls.landform")

export const lsRelief = LandscapeTools.fn((tools, w: Worldspace2) => {
	return (
		tools.sample(w, 15_000, hasher("relief1"))
		// tools.sample(w, 5_000, hasher("relief2"))
	)
})

export const lsBathymetry = LandscapeTools.fn(
	(_tools, bedrock: number, sealevel: number, seafloor: number) => {
		return remap(bedrock, 0, sealevel, seafloor, 0)
	}
)

export const lsLand = LandscapeTools.fn(
	(_tools, bedrock: number, sealevel: number) => {
		return remap(bedrock, sealevel, 1)
	}
)

export const lsLandform = LandscapeTools.fn(
	(tools, w: Worldspace2, land: number) => {
		const cliffsy = tools.sample(w, 10_000, hasher("cliffsy")) ** 3
		return smoothly(land, [
			0,
			lerp(cliffsy, .1, .9),
			1,
		])
	}
)

