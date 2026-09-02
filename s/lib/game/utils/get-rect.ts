
import {Rect, Vec2, Tuple2} from "@benev/math"

export function getRect(components: {position: Tuple2, size: Tuple2}) {
	return Rect.fromCenter(
		Vec2.from(components.position),
		Vec2.from(components.size),
	)
}

