
import {hash32} from "@e280/stz"
import {clamp, invert, remap, smoothly} from "@benev/math"
import {LandscapeTools} from "../tools.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const spline = [0, 1, 1, 1]
const offset = hash32("ls.bedrock")

const offsetChaos = hash32("ls.bedrock.chaos")
const offsetStretchy = hash32("ls.bedrock.stretchy")

export const lsBedrock = LandscapeTools.fn(
	(tools, w: Worldspace2) => {
		const {warp, percent} = tools

		const baseGradient = tools.radialGradient(w)
		const mask = smoothly(baseGradient, spline)

		const chaos = clamp(remap(tools.sample(w, percent(30), offsetChaos), 0, 0.5))
		const stretchy = tools.sample(w, percent(30), offsetStretchy)
		const nonStretchy = invert(stretchy)

		w = w.dup()

		warp(w, offset, 700, mask * nonStretchy * chaos * 500)

		warp(w, offset, percent(5), mask * nonStretchy * chaos * percent(4))
		warp(w, offset, percent(20), mask * nonStretchy * chaos * percent(15))
		warp(w, offset, percent(40), mask * nonStretchy * percent(30))

		warp(w, offset, percent(60), mask * percent(40))

		warp(w, offset, percent(40), mask * stretchy * percent(30))
		warp(w, offset, percent(20), mask * stretchy * chaos * percent(15))
		warp(w, offset, percent(5), mask * stretchy * chaos * percent(4))

		return tools.radialGradient(w)
	}
)

