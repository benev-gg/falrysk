
import {lerp, remap, smoothly} from "@benev/math"
import {LandscapeTools} from "../tools.js"
import {makeHasher} from "../utils/hasher.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const hasher = makeHasher("ls.landform")

export const lsRelief = LandscapeTools.fn((tools, w: Worldspace2) => {
	return (
		tools.sample(w, 15_000, hasher("relief1"))
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

const steps = [
	0.00,
	0.02,
	0.04,
	0.06,
	0.08,
	0.40,
	0.42,
	0.44,
	0.80,
	0.84,
	0.96,
	0.98,
	1.00,
]

export const lsLandform = LandscapeTools.fn(
	(tools, w: Worldspace2, land: number) => {
		const factor = tools.sample(w, 10_000, hasher("factor")) ** 2
		const natty = land
		const steppy = smoothly(land, steps)
		return lerp(factor, natty, steppy)
	}
)

