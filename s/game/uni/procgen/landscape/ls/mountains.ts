
import {hash32} from "@e280/stz"
import {clamp, invert, lerp} from "@benev/math"

import {LandscapeTools} from "../tools.js"
import {Worldspace2} from "../../../coords/worldspace.js"

const offsetWarp = hash32("ls.mountains.warp")
const offsetRidge = hash32("ls.mountains.ridge")
const offsetDetail = hash32("ls.mountains.detail")
const offsetMassif = hash32("ls.mountains.massif")
const offsetE1 = hash32("ls.mountains.e1")
const offsetE2 = hash32("ls.mountains.e2")
const offsetE3 = hash32("ls.mountains.e3")
const offsetAttenuate = hash32("ls.mountains.attenuate")

const ridge = (n: number) => 1 - Math.abs(n * 2 - 1)

function stronger(noul: number, power = 2) {
	noul = invert(noul)
	noul = noul ** power
	return invert(noul)
}

function weaker(noul: number, power = 2) {
	return noul ** power
}

export const lsMountains = LandscapeTools.fn(
	({warp, sample}, w: Worldspace2, mountainous: number) => {
		mountainous = clamp(mountainous)
		if (mountainous === 0) return 0

		const e1 = sample(w, 3_000, offsetE1) / 2
		const e2 = sample(w, 500, offsetE2) / 4
		const erosionFactor = weaker(sample(w, 5_000, offsetE3), 4)
		const erosion = invert(lerp(erosionFactor, 0, clamp(e1 + e2)))

		const factor = stronger(sample(w, 10_000, offsetAttenuate), 3)
		const massif = sample(w, 10_000, offsetMassif)

		w = w.dup()
		warp(w, offsetWarp, 6_000, 3_000)

		const r1 = ridge(sample(w, 4_000, offsetRidge))
		const r2 = ridge(sample(w, 1_000, offsetDetail))
		const ridges = (r1 * (0.7 + (r2 * 0.3))) * erosion

		const massifness = 0.5
		const ridgeness = invert(massifness)

		return mountainous * factor * (
			(massif * massifness) +
			(ridges * ridgeness)
		)
	}
)

