
import {EntitiesReadonly} from "@benev/archimedes"

import {Venue} from "./venue.js"
import {Realm} from "../realm.js"
import {setupRender} from "../render.js"
import {PlayerId} from "../../game/types.js"
import {GameComponents} from "../../game/parts/components.js"

export type Stage = ReturnType<typeof makeStage>

export function makeStage(options: {
		venue: Venue
		playerId: PlayerId
		entities: EntitiesReadonly<GameComponents>
	}) {

	const {venue} = options
	const realm = new Realm(options)
	const render = setupRender(realm)

	return {venue, realm, render}
}

