
import {applyDelta, Change, Entities} from "@benev/archimedes"

import {Pod} from "./parts/pod.js"
import {systems} from "./systems.js"
import {GameComponents} from "./parts/components.js"
import {IntentBucketMap} from "./utils/intent-bucket-map.js"

export class Game {
	change
	simulate

	constructor(players: IntentBucketMap | null) {
		const entities = new Entities<GameComponents>()
		this.change = new Change(delta => applyDelta(entities, delta))
		this.simulate = systems(new Pod(entities.readonly, this.change, players))
	}

	init() {
		// const rand = new Rand(seed(consts.map.seed))
		// this.change.create({})
		return this
	}
}

