
import {Intent} from "@benev/tact"
import {bool, Entities, f32, id, json} from "@benev/archimedes"

import {bvec2, bvec3, landscape} from "./components.js"

export type GameEntities = ReturnType<typeof makeEntities>
export type GameEntitiesReadonly = GameEntities["readonly"]

export const makeEntities = () => new Entities({
	debug: bool,
	scale: f32,
	position: bvec3,
	rotation: f32,
	size: bvec2,
	gimbal: bvec2,
	controlledBy: id,
	landscape,
	intents: json<Intent[]>({version: "8722e49741ec200d02dddb1e817bc0fd"}),
})

