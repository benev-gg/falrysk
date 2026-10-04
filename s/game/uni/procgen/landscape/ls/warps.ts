
import {clamp, remap, smoothly} from "@benev/math"
import {LandscapeTools} from "../tools.js"
import {makeHasher} from "../utils/hasher.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const spline = [0, .9, 1]
const hasher = makeHasher("warps")

export const lsSmallWarp = LandscapeTools.fn(
	(tools, w: Worldspace2, power: number, seed = hasher("base")) => {
		const {warp} = tools

		const mask = power * smoothly(tools.radialGradient(w), spline)
		const strength = mask * clamp(remap(tools.sample(w, 15_000, hasher("smallchaos") + seed), 0, 0.5))

		const o = hasher("small") + seed
		warp(w, o, 500, strength * 400)
		warp(w, o, 2000, strength * 1500)
		warp(w, o, 7000, strength * 5000)

		return w
})

export const lsBigWarp = LandscapeTools.fn(
	(tools, w: Worldspace2, power: number, seed = hasher("base")) => {
		const {warp, percent} = tools

		const mask = power * smoothly(tools.radialGradient(w), spline)
		const chaos1 = mask * clamp(remap(tools.sample(w, 15_000, hasher("bigchaos1") + seed), 0, 0.5))
		const chaos2 = mask * clamp(remap(tools.sample(w, 15_000, hasher("bigchaos2") + seed), 0, 0.5))

		const o = hasher("big") + seed
		warp(w, o, percent(40), chaos1 * percent(30))
		warp(w, o, percent(60), mask * percent(40))
		warp(w, o, percent(40), chaos2 * percent(30))

		return w
})

