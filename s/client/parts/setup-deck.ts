
import {Content} from "@e280/sly"
import {DeskView} from "@benev/tact/ui"
import {LocalStore} from "@e280/strata"
import {Controller, Deck, DeckState, Devices, GamepadDevice, KeyboardDevice, onPad, PointerDevice} from "@benev/tact"

import {stockProfiles} from "./stock-profiles.js"

export type GameDeck = ReturnType<typeof setupDeck>["deck"]

export function setupDeck() {
	const store = new LocalStore<DeckState>("tactDeck")
	const deck = new Deck({store, stockProfiles})

	deck.load()
	store.onStorageEvent(() => deck.load())

	const port = deck.createPort()
	const controller = deck.createController("primary", "standard", new Devices(
		new KeyboardDevice(),
		new PointerDevice(),
	))

	port.plug(controller)

	const labels = new Map<Controller, Content>()
		.set(controller, "⌨️🖱keyboard+mouse")

	onPad(pad => {
		const handle = `(${pad.gamepad.index + 1}) ${pad.gamepad.id}`
		const controller = deck.createController(handle, "xinput", new GamepadDevice(pad))
		labels.set(controller, `🎮${handle}`)

		// // TODO decide if gamepads should autospawn their own ports
		// const port = deck.createPort()
		port.plug(controller)

		return () => {
			deck.deletePort(port)
			deck.deleteController(controller)
		}
	})

	const getControllerLabel = labels.get.bind(labels)
	const renderDesk = () => DeskView(deck, {getControllerLabel})

	return {deck, renderDesk}
}

