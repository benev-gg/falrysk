
import {hash32} from "@e280/stz"
import {lerp, remap, smoothly} from "@benev/math"
import {LandscapeTools} from "../tools.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const reliefOffset = hash32("ls.relief")
const inlandyOffset = hash32("ls.inlandy")

export const lsRelief = LandscapeTools.fn((tools, w: Worldspace2) => {
	return tools.sample(w, tools.percent(25), reliefOffset)
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
		const inlandy = tools.sample(w, tools.percent(25), inlandyOffset) ** 3
		return smoothly(land, [
			0,
			lerp(inlandy, .1, .9),
			1,
		])
	}
)

