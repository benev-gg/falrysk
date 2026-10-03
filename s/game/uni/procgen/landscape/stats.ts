
import {count2d} from "@e280/stz"
import {Landscape} from "./landscape.js"
import {Worldspace2} from "../../coords/worldspace.js"

export function logLandscapeStats(landscape: Landscape) {
	const resolution = 512
	const size = landscape.getSize()

	let w = Worldspace2.zero()
	let landCount = 0
	let highest = 0
	let deepest = 0

	for (let [x, y] of count2d([resolution, resolution])) {
		const elevation = landscape.getElevation(
			w.set_(
				(x / resolution) * size.x,
				(y / resolution) * size.y,
			)
		)

		if (elevation > 0)
			landCount++

		if (elevation > highest)
			highest = elevation

		if (elevation < deepest)
			deepest = elevation
	}

	const landFraction = landCount / (resolution * resolution)
	const worldSquareMeters = size.x * size.y
	const landSquareMeters = landFraction * worldSquareMeters
	const landSquareKm = landSquareMeters / 1_000_000
	const worldSquareKm = worldSquareMeters / 1_000_000
	const oceanSquareKm = worldSquareKm - landSquareKm

	console.log(`land    ${landSquareKm.toFixed(0)}km²`)
	console.log(`sea     ${oceanSquareKm.toFixed(0)}km²`)
	console.log(`highest ${highest.toFixed(0)}m`)
	console.log(`deepest ${deepest.toFixed(0)}m`)
}

