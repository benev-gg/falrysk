
export function applySensitivity(

		/** vertical field of view, in radians. */
		fov: number,

		/** microverts-per-dot. */
		sensitivity: number,

		/** how many dots the mouse has moved, in raw mouse input counts. */
		dots: number,

	) {

	const movement_amount_in_microverts = dots * sensitivity
	const actual_angle_of_one_microvert = 1e-6 * fov
	return movement_amount_in_microverts * actual_angle_of_one_microvert
}

