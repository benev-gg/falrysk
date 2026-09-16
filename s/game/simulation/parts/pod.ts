
import {Rand, seed} from "@e280/stz"
import {Lattice, Vec2} from "@benev/math"
import {Actions, Intent} from "@benev/tact"
import {Change, EntitiesReadonly, Id} from "@benev/archimedes"

import {PlayerId} from "../types.js"
import {Phys} from "../utils/phys.js"
import {bindings} from "./bindings.js"
import {consts} from "../../../consts.js"
import {GameComponents} from "./components.js"
import {SimulationClock} from "../utils/simulation-clock.js"
import {Physics} from "../../../lib/physics/physics.js"

export class Pod {
	actions = new Map<PlayerId, Actions<typeof bindings>>()
	inputs = new Map<PlayerId, Intent[]>()
	timing = new SimulationClock(consts.simulationHz)
	physics = new Physics()
	physLattice = new Lattice<Phys>(new Vec2(8, 8))
	targetLattice = new Lattice<Id>(new Vec2(8, 8))
	rand = new Rand(seed(1))

	constructor(
		public entities: EntitiesReadonly<GameComponents>,
		public change: Change<GameComponents>,
	) {}
}

