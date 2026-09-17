
import {Rand, seed} from "@e280/stz"
import {clamp, makeNoiseSampler} from "@benev/math"
import {smoothstep} from "../../../lib/tools/smoothstep.js"
import {Worldspace2, Worldspace3} from "../coords/worldspace.js"

export class Oracle {
	rand
	#noise

	constructor(public options: {
			seed: number
			size: Worldspace2
		}) {
		this.rand = new Rand(seed(options.seed))
		this.#noise = makeNoiseSampler(this.rand.random)
	}

	elevation(w: Worldspace2) {
		const {x, y} = w
		const island = this.islandness(w)

		// gently warp the terrain so the large structures feel more natural
		const warpX =
			(this.#noise(x + 9_100, y - 3_700, .00012) - .5) * 2_000

		const warpY =
			(this.#noise(x - 6_300, y + 8_200, .00012) - .5) * 2_000

		const wx = x + warpX
		const wy = y + warpY

		// enormous bedrock-scale swells and basins
		const basementLarge =
			(this.#noise(
				wx + 31_000,
				wy - 17_000,
				.000035,
			) - .5) * 2

		const basementMedium =
			(this.#noise(
				wx - 21_000,
				wy + 26_000,
				.000075,
			) - .5) * 2

		const basement =
			basementLarge * .7 +
			basementMedium * .3

		// broad regional uplift decides where mountain country can exist
		const uplift =
			this.#noise(wx + 14_000, wy - 7_000, .00008)

		const mountainness =
			smoothstep(uplift, .45, .72)

		// broad landscape
		const macro =
			(this.#noise(wx, wy, .00015) - .5) * 2

		const hills =
			(this.#noise(wx + 4_300, wy - 8_700, .0005) - .5) * 2

		// primary mountain-chain structure
		const ridgeNoise =
			this.#noise(wx - 9_000, wy + 3_000, .00025)

		const ridge =
			1 - Math.abs(ridgeNoise * 2 - 1)

		// secondary cragginess along the ridge
		const cragNoise =
			this.#noise(wx + 2_300, wy - 7_100, .0014)

		const crags =
			1 - Math.abs(cragNoise * 2 - 1)

		// finer crag breakup
		const fineNoise =
			this.#noise(wx - 4_700, wy + 1_900, .0038)

		const fineCrags =
			1 - Math.abs(fineNoise * 2 - 1)

		// shape the ridge into a sharper alpine spine
		const craggyRidge =
			(ridge ** 3)
			* (1 + (crags - .5) * .16)
			* (1 + (fineCrags - .5) * .05)

		const mountains =
			craggyRidge
			* mountainness

		// general terrain texture
		const detail =
			(this.#noise(wx + 1_234, wy + 5_678, .002) - .5) * 2

		const relief =
			basement * 280 +
			macro * 180 +
			hills * 100 +
			mountains * 400 +
			detail * 20

		// islandness establishes the continent:
		// edge = seabed, center = elevated land
		const seabed = -200
		const landbase = 120

		const base =
			seabed +
			(landbase - seabed) * island

		return base + relief * island
	}

	islandness(w: Worldspace2) {
		const {size} = this.options

		const cx = size.x / 2
		const cy = size.y / 2

		const radius = Math.min(size.x, size.y) / 2

		const nx = (w.x - cx) / radius
		const ny = (w.y - cy) / radius

		// distort the coastline at a scale of several kilometres
		const coastNoise =
			this.#noise(
				w.x + 23_000,
				w.y - 11_000,
				.00018,
			)

		const coastWarp =
			(coastNoise - .5) * .20

		const distance =
			Math.hypot(nx, ny) + coastWarp

		// broad interior, then a reasonably gradual coastal shelf
		const shore = .72
		const t = clamp(
			(distance - shore) / (1 - shore),
		)

		return 1 - smoothstep(t, 0, 1)
	}

	normal(p: Worldspace2) {
		const d = 1

		const dx =
			this.elevation(new Worldspace2(p.x + d, p.y)) -
			this.elevation(new Worldspace2(p.x - d, p.y))

		const dy =
			this.elevation(new Worldspace2(p.x, p.y + d)) -
			this.elevation(new Worldspace2(p.x, p.y - d))

		return new Worldspace3(-dx, -dy, 2 * d).normalize()
	}
}

