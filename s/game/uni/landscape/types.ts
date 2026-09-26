
import {Worldspace2} from "../coords/worldspace.js"

export type LandscapeData = {
	params: WorldParams
	surveys: Surveys
	waterways: Waterways
}

export type WorldParams = {
	seed: number
	size: Worldspace2
}

export type SampleFn = (w: Worldspace2) => number
export type NoiseFn = (x: number, y?: number, scale?: number) => number

export type Surveys = {
	flow: Uint8Array
	basins: Uint16Array
	humidity: Uint8Array
	drainage: Float32Array
}

export type Waterways = {
	// TODO: later
	// rivers: River[]
	// lakes: Lake[]
}

