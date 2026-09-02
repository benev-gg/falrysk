
import {applyDelta, Change, Entities} from "@benev/archimedes"

import {Pod} from "./parts/pod.js"
import {systems} from "./systems.js"
import {GameComponents} from "./parts/components.js"
import {IntentBucketMap} from "./utils/intent-bucket-map.js"

export class Game {
	pod
	simulate
	entities: Entities<GameComponents> = new Entities<GameComponents>()
	change: Change<GameComponents> = new Change<GameComponents>(delta => applyDelta(this.entities, delta))

	constructor(players: IntentBucketMap | null) {
		const change = new Change(delta => applyDelta(this.entities, delta))
		this.pod = new Pod(this.entities.readonly, change, players)
		this.simulate = systems(this.pod)
	}

	init() {
		// const rand = new Rand(seed(consts.map.seed))
		// this.change.create({})
		return this
	}
}

