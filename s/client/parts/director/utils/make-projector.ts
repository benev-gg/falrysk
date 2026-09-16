
import {got} from "@e280/stz"
import {renderFrame} from "@babylonjs/lite"
import {EntitiesReadonly} from "@benev/archimedes"

import {consts} from "../../../../consts.js"
import {Realm} from "../../../../game/renderer/realm.js"
import {LocalPlayers} from "../../inputs/local-players.js"
import {Catalog} from "../../../../game/renderer/catalog.js"
import {setupVenue} from "../../../../game/renderer/venue.js"
import {setupScene} from "../../../../game/renderer/scene.js"
import {PlayerId} from "../../../../game/simulation/types.js"
import {setupRenderSystems} from "../../../../game/renderer/systems.js"
import {GameComponents} from "../../../../game/simulation/parts/components.js"

export async function makeProjector(
		playerId: PlayerId,
		players: LocalPlayers,
		entities: EntitiesReadonly<GameComponents>,
		catalog: Catalog,
	) {

	const venue = await setupVenue({playerId, entities, catalog})

	try {
		const getActions = () => got(players.actions.get(playerId))
		const realm = new Realm(venue)
		const runRenderSystems = setupRenderSystems(realm)

		await setupScene(realm)

		const render = (dt: number) => {
			runRenderSystems()
			renderFrame(realm.venue.engine, dt)
		}

		const dispose = () => {
			realm.dispose()
			venue.dispose()
		}

		render(1000 / consts.simulationHz)

		return {playerId, realm, getActions, render, dispose}
	}
	catch (error) {
		venue.dispose()
		throw error
	}
}

