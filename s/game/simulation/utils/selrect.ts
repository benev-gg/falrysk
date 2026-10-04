
import {Rect, Vec2, XyArray} from "@benev/math"

export function selrect(components: {
		position: XyArray,
		reach: number,
		rotation: number,
	}) {

	const extent = Vec2.fill(components.reach)

	const center = new Vec2()
		.from(components.position)
		.add(
			new Vec2(components.reach / 2, 0)
				.rotate(components.rotation)
		)

	return Rect.fromCenter(center, extent)
}

