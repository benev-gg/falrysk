
import {Intent} from "@benev/tact"
import {XyArray} from "@benev/math"
import {AsComponents, Id} from "@benev/archimedes"

export type GameComponents = AsComponents<{

	/** render debug visualizers */
	debug: true

	/** total scaling of the art */
	scale: number

	/** centerpoint position in gridspace coordinates */
	position: XyArray

	/** rotation in radians where this entity is aiming/pointing */
	rotation: number

	/** rectangular extent */
	size: XyArray

	/** which player entity we're controlled by */
	controlledBy: Id

	/** player user inputs */
	intents: Intent[]
}>

