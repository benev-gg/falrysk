
import {Content} from "@e280/sly"
import {Cubby} from "@e280/strata"
import {Controller, Deck, DeckState, Devices, GamepadDevice, KeyboardDevice, onPad, PointerDevice} from "@benev/tact"

import {stockProfiles} from "./stock-profiles.js"
import {onStorageEvent} from "../../../lib/web/on-storage-event.js"

export type GameDeck = ReturnType<typeof setupDeck>["deck"]

export function setupDeck(store: Cubby<DeckState>) {
	const deck = new Deck({store, stockProfiles})

	deck.load()
	onStorageEvent(() => deck.load())

	const port = deck.createPort()
	const controller = deck.createController("primary", "standard", new Devices(
		new KeyboardDevice(),
		new PointerDevice(),
	))

	port.plug(controller)

	const controllerLabels = new Map<Controller, Content>()
		.set(controller, "⌨️🖱keyboard+mouse")

	onPad(pad => {
		const handle = `(${pad.gamepad.index + 1}) ${pad.gamepad.id}`
		const controller = deck.createController(handle, "xinput", new GamepadDevice(pad))
		controllerLabels.set(controller, `🎮${handle}`)
		port.plug(controller)

		return () => {
			port.unplug(controller)
			deck.deleteController(controller)
		}
	})

	function getControllerLabel(controller: Controller) {
		return controllerLabels.get(controller)
	}

	return {deck, getControllerLabel}
}

