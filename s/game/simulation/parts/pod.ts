
import {Id} from "@benev/archimedes"
import {mulberry, Rand} from "@e280/stz"
import {Lattice, Vec2} from "@benev/math"
import {Actions, Intent} from "@benev/tact"

import {PlayerId} from "../types.js"
import {Phys} from "../utils/phys.js"
import {bindings} from "./bindings.js"
import {consts} from "../../../consts.js"
import {GameEntities} from "./entitites.js"
import {Physics} from "../../../lib/physics/physics.js"
import {SimulationClock} from "../utils/simulation-clock.js"

export class Pod {
	inputs = new Map<PlayerId, Intent[]>()
	actions = new Map<PlayerId, Actions<typeof bindings>>()

	rand = new Rand(mulberry(1))
	timing = new SimulationClock(consts.simulationHz)
	physics = new Physics()
	physLattice = new Lattice<Phys>(new Vec2(8, 8))
	targetLattice = new Lattice<Id>(new Vec2(8, 8))

	constructor(public entities: GameEntities) {}
}

