
import {WorldParams, LandscapeData} from "./types.js"
import {makeNoise, makeRand} from "../../../lib/tools/rand.js"

export function makeLandscapeData(params: WorldParams): LandscapeData {
	const rand = makeRand("landscape.rand", params.seed)
	const noise = makeNoise("landscape.noise", params.seed)

	// TODO:
	const surveys: any = {}
	const waterways: any = {}

	return {
		params,
		surveys,
		waterways,
	}
}

