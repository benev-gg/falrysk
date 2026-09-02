
import {IntentBucket} from "@benev/tact"
import {PlayerId} from "../types.js"

export class Player {
	intents = new IntentBucket()
	constructor(public readonly id: PlayerId) {}
}

