
import {Rect, Tuple2, Vec2} from "@benev/math"

export function selrect(components: {
		position: Tuple2,
		reach: number,
		rotation: number,
	}) {

	const extent = Vec2.all(components.reach)

	const center = new Vec2()
		.from(components.position)
		.add(
			new Vec2(components.reach / 2, 0)
				.rotate(components.rotation)
		)

	return Rect.fromCenter(center, extent)
}

