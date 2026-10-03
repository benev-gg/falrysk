
import {invert, lerp, linearly} from "@benev/math"

import {LandscapeTools} from "../tools.js"
import {makeHasher} from "../utils/hasher.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const hasher = makeHasher("mountains")
const ridge = (x: number) => linearly(x, [0, 1, 0])

export const lsMountains = LandscapeTools.fn(
	({sample}, warped: Worldspace2, unwarped: Worldspace2) => {
		const r1 = ridge(sample(warped, 10_000, hasher("r1")))
		const r2 = ridge(sample(unwarped, 3_000, hasher("r2")))
		const ridges = (
			(r1 * .8) +
			(r2 * .2)
		)

		const damagedRegion = sample(unwarped, 3_000, hasher("dmg")) ** 2
		const cuts = sample(unwarped, 1_200, hasher("cuts")) ** 2
		const chips = sample(unwarped, 250, hasher("chips")) ** 2

		const damagePoints = invert(
			(cuts * .4) +
			(chips * .15)
		)
		const damage = lerp(
			damagedRegion * ridges,
			1,
			damagePoints,
		)

		return ridges * damage
	}
)

