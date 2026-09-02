
import {Lattice, Vec2} from "@benev/math"
import {need, Rand, seed} from "@e280/stz"
import {Change, EntitiesReadonly, Id} from "@benev/archimedes"

import {Phys} from "../utils/phys.js"
import {consts} from "../../../consts.js"
import {ActorMap} from "../utils/actor.js"
import {Timing} from "../../tools/timing.js"
import {GameComponents} from "./components.js"
import {Physics} from "../../physics/physics.js"
import {IntentBucketMap} from "../utils/intent-bucket-map.js"

export class Pod {
	timing = new Timing(consts.simulationHz.min, consts.simulationHz.max)
	physics = new Physics()
	physLattice = new Lattice<Phys>(new Vec2(8, 8))
	targetLattice = new Lattice<Id>(new Vec2(8, 8))
	actors = new ActorMap()
	rand = new Rand(seed(1))

	constructor(
		public entities: EntitiesReadonly<GameComponents>,
		public change: Change<GameComponents>,
		public players: IntentBucketMap | null,
	) {}

	getActions(playerId: string) {
		return need(this.actors, playerId).actions
	}
}

