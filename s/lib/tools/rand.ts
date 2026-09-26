
import {makeNoiseSampler} from "@benev/math"
import {hash32, mulberry, Rand} from "@e280/stz"

export function makeRand(...entropy: (number | string)[]) {
	return new Rand(mulberry(hash32(...entropy)))
}

export function makeNoise(...entropy: (number | string)[]) {
	return makeNoiseSampler(mulberry(hash32(...entropy)))
}

