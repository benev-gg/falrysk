import {oldSmoothstep} from "../../../lib/tools/math.js"
import {makeNoise, makeRand} from "../../../lib/tools/rand.js"

import {surveySize} from "./consts.js"
import {
	LandscapeData,
	NoiseFn,
	SampleFn,
	Surveys,
	Waterways,
	WorldParams,
} from "./types.js"

type Ridge = {
	angle: number
	offset: number
	halfLength: number
	width: number
	wander: number
}

type Mountain = {
	x: number
	y: number
	angle: number
	length: number
	width: number
	height: number
	sharpness: number
}

type Volcano = {
	x: number
	y: number
	radius: number
	height: number
	craterRadius: number
	craterDepth: number
}

export function makeLandscapeData(params: WorldParams): LandscapeData {
	const rand = makeRand("landscape.rand", params.seed)
	const noise = makeNoise("landscape.noise", params.seed)

	const bedrock = makeBedrock(
		params,
		rand,
		noise,
	)

	const surveys: Surveys = {
		flow: new Uint8Array(surveySize),
		basins: new Uint16Array(surveySize),
		humidity: new Uint8Array(surveySize),
		drainage: new Float32Array(surveySize),
	}

	const waterways: Waterways = {}

	// next:
	// survey bedrock
	// flow
	// basins
	// humidity
	// drainage
	// waterways
	// erosion
	// resurvey

	void bedrock

	return {
		params,
		surveys,
		waterways,
	}
}

export function makeBedrock(
	params: WorldParams,
	rand = makeRand("landscape.rand", params.seed),
	noise: NoiseFn = makeNoise("landscape.noise", params.seed),
): SampleFn {
	const {size} = params

	const span = Math.min(
		size.x,
		size.y,
	)

	const cx = size.x / 2
	const cy = size.y / 2

	//
	// tectonic spine
	//

	const ridge: Ridge = {
		angle:
			rand.random() *
			Math.PI,

		offset:
			(rand.random() - .5) *
			span *
			.10,

		halfLength:
			span *
			(.47 + rand.random() * .07),

		width:
			span *
			(.075 + rand.random() * .020),

		wander:
			span *
			(.025 + rand.random() * .018),
	}

	const cos = Math.cos(ridge.angle)
	const sin = Math.sin(ridge.angle)

	const ridgeBend = (along: number) => {
		const broad =
			(
				noise(
					along + span * 1.73,
					span * .37,
					2.2 / span,
				) -
				.5
			) * 2

		const secondary =
			(
				noise(
					along - span * .81,
					span * 1.91,
					4.5 / span,
				) -
				.5
			) * 2

		return (
			ridge.offset +
			broad * ridge.wander +
			secondary * ridge.wander * .25
		)
	}

	const ridgeCoords = (
		x: number,
		y: number,
	) => {
		const dx = x - cx
		const dy = y - cy

		const along =
			dx * cos +
			dy * sin

		const across =
			-dx * sin +
			dy * cos -
			ridgeBend(along)

		return {
			along,
			across,
		}
	}

	const ridgePoint = (
		along: number,
		acrossOffset = 0,
	) => {
		const across =
			ridgeBend(along) +
			acrossOffset

		return {
			x:
				cx +
				along * cos -
				across * sin,

			y:
				cy +
				along * sin +
				across * cos,
		}
	}

	//
	// mountain primitives
	//

	const mountains: Mountain[] = []

	const mountainCount =
		7 +
		Math.floor(
			rand.random() * 3,
		)

	for (let i = 0; i < mountainCount; i++) {
		const t =
			(i + .5) /
			mountainCount

		const along =
			(t * 2 - 1) *
				ridge.halfLength *
				.88 +
			(rand.random() - .5) *
				span *
				.035

		const across =
			(rand.random() - .5) *
			ridge.width *
			.75

		const p =
			ridgePoint(
				along,
				across,
			)

		mountains.push({
			x: p.x,
			y: p.y,

			angle:
				ridge.angle +
				(rand.random() - .5) *
					.35,

			length:
				span *
				(
					.045 +
					rand.random() * .040
				),

			width:
				span *
				(
					.024 +
					rand.random() * .020
				),

			height:
				260 +
				rand.random() * 440,

			sharpness:
				.85 +
				rand.random() * .9,
		})
	}

	//
	// branching mountain spurs
	//

	const spurCount =
		3 +
		Math.floor(
			rand.random() * 3,
		)

	for (let i = 0; i < spurCount; i++) {
		const along =
			(rand.random() * 2 - 1) *
			ridge.halfLength *
			.72

		const side =
			rand.random() < .5
				? -1
				: 1

		const across =
			side *
			ridge.width *
			(.35 + rand.random() * .65)

		const p =
			ridgePoint(
				along,
				across,
			)

		mountains.push({
			x: p.x,
			y: p.y,

			angle:
				ridge.angle +
				side *
				(
					.25 +
					rand.random() * .45
				),

			length:
				span *
				(
					.035 +
					rand.random() * .030
				),

			width:
				span *
				(
					.018 +
					rand.random() * .016
				),

			height:
				140 +
				rand.random() * 260,

			sharpness:
				.8 +
				rand.random() * .8,
		})
	}

	//
	// volcanoes
	//

	const volcanoCount =
		2 +
		Math.floor(
			rand.random() * 3,
		)

	const volcanoes: Volcano[] =
		Array.from(
			{length: volcanoCount},

			(_, i) => {
				const t =
					(i + 1) /
					(volcanoCount + 1)

				const along =
					(t * 2 - 1) *
						ridge.halfLength *
						.80 +
					(rand.random() - .5) *
						span *
						.025

				const across =
					(rand.random() - .5) *
					ridge.width *
					.40

				const p =
					ridgePoint(
						along,
						across,
					)

				const radius =
					span *
					(
						.045 +
						rand.random() * .030
					)

				const height =
					500 +
					rand.random() * 700

				return {
					x: p.x,
					y: p.y,
					radius,
					height,

					craterRadius:
						radius *
						(
							.06 +
							rand.random() * .05
						),

					craterDepth:
						height *
						(
							.08 +
							rand.random() * .10
						),
				}
			},
		)

	//
	// continuous bedrock sampler
	//

	return w => {
		const {x, y} = w

		//
		// island
		//

		const nx =
			(x - cx) /
			(size.x / 2)

		const ny =
			(y - cy) /
			(size.y / 2)

		const coastBroad =
			(
				noise(
					x + span * 2.3,
					y - span * 1.1,
					4 / span,
				) -
				.5
			) * .18

		const coastFine =
			(
				noise(
					x - span * 1.7,
					y + span * 2.6,
					9 / span,
				) -
				.5
			) * .05

		const islandDistance =
			Math.hypot(nx, ny) +
			coastBroad +
			coastFine

		const island =
			1 -
			oldSmoothstep(
				islandDistance,
				.70,
				1.02,
			)

		//
		// literal map edge must be ocean
		//

		const edgeDistance =
			Math.max(
				Math.abs(nx),
				Math.abs(ny),
			)

		const edgeFade =
			1 -
			oldSmoothstep(
				edgeDistance,
				.91,
				1,
			)

		const islandness =
			island *
			edgeFade

		const interior =
			islandness ** 1.15

		//
		// continental base
		//

		const seabed = -220
		const landbase = 95

		const base =
			seabed +
			(landbase - seabed) *
				islandness

		//
		// broad plains and hills
		//

		const continental =
			(
				noise(
					x + span * 3.7,
					y - span * 2.1,
					2 / span,
				) -
				.5
			) * 2

		const hills =
			(
				noise(
					x - span * 1.3,
					y + span * 4.2,
					6 / span,
				) -
				.5
			) * 2

		const regional =
			continental * 85 +
			hills * 45

		//
		// broad tectonic uplift
		//

		const {
			along,
			across,
		} = ridgeCoords(x, y)

		const acrossMask =
			1 -
			oldSmoothstep(
				Math.abs(across),
				ridge.width * .20,
				ridge.width * 1.65,
			)

		const alongMask =
			1 -
			oldSmoothstep(
				Math.abs(along),
				ridge.halfLength * .72,
				ridge.halfLength,
			)

		const tectonicMask =
			acrossMask *
			alongMask *
			islandness

		const tectonicUplift =
			tectonicMask *
			120

		//
		// gently warp mountain geometry
		//

		const warpX =
			(
				noise(
					x + span * 7.1,
					y - span * 4.3,
					5 / span,
				) -
				.5
			) *
			span *
			.018

		const warpY =
			(
				noise(
					x - span * 5.2,
					y + span * 8.7,
					5 / span,
				) -
				.5
			) *
			span *
			.018

		const wx =
			x + warpX

		const wy =
			y + warpY

		//
		// explicit mountain shapes
		//

		let mountainCubes = 0

		for (const mountain of mountains) {
			const dx =
				wx - mountain.x

			const dy =
				wy - mountain.y

			const cos =
				Math.cos(
					mountain.angle,
				)

			const sin =
				Math.sin(
					mountain.angle,
				)

			const localX =
				dx * cos +
				dy * sin

			const localY =
				-dx * sin +
				dy * cos

			const distance =
				Math.hypot(
					localX /
						mountain.length,

					localY /
						mountain.width,
				)

			const body =
				Math.max(
					0,
					1 - distance,
				)

			const foot =
				oldSmoothstep(
					body,
					0,
					.16,
				)

			const shape =
				foot *
				body ** mountain.sharpness

			const height =
				mountain.height *
				shape

			mountainCubes +=
				height *
				height *
				height
		}

		let mountainMass =
			Math.cbrt(
				mountainCubes,
			)

		//
		// irregular rock structure
		//
		// ordinary noise, not ridged noise:
		// this should roughen mountains without
		// creating endless parallel folds.
		//

		const roughBroad =
			(
				noise(
					wx + span * 2.7,
					wy - span * 5.9,
					10 / span,
				) -
				.5
			) * 2

		const roughMedium =
			(
				noise(
					wx - span * 8.1,
					wy + span * 3.4,
					22 / span,
				) -
				.5
			) * 2

		const roughFine =
			(
				noise(
					wx + span * 11.7,
					wy + span * 6.2,
					42 / span,
				) -
				.5
			) * 2

		const roughness =
			1 +
			roughBroad * .20 +
			roughMedium * .10 +
			roughFine * .035

		mountainMass *=
			roughness *
			interior

		//
		// volcanoes
		//

		let volcanic = 0

		for (const volcano of volcanoes) {
			const dx =
				x - volcano.x

			const dy =
				y - volcano.y

			const irregularity =
				(
					noise(
						x + span * 4.7,
						y - span * 5.3,
						10 / span,
					) -
						.5
				) *
				.10

			const distance =
				Math.hypot(
					dx,
					dy,
				) *
				(1 + irregularity)

			const body =
				Math.max(
					0,
					1 -
						distance /
							volcano.radius,
				)

			const cone =
				oldSmoothstep(
					body,
					0,
					.12,
				) *
				body ** 1.3

			volcanic +=
				volcano.height *
				cone

			const craterBody =
				Math.max(
					0,
					1 -
						distance /
							volcano.craterRadius,
				)

			volcanic -=
				volcano.craterDepth *
				oldSmoothstep(
					craterBody,
					0,
					.35,
				)
		}

		volcanic *=
			interior

		//
		// subtle bedrock texture
		//

		const detail =
			(
				noise(
					x - span * 6.1,
					y + span * 3.8,
					24 / span,
				) -
					.5
			) *
			2 *
			12

		return (
			base +
			(
				regional +
				tectonicUplift +
				mountainMass +
				volcanic +
				detail
			) *
				interior
		)
	}
}
