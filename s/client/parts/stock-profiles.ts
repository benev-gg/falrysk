
import {asBindings, Profile} from "@benev/tact"
import {bindings} from "../../lib/game/parts/bindings.js"

export const stockProfiles = {
	standard: {label: "📜standard", bindings},

	xinput: {label: "🎮xinput", bindings: asBindings<typeof bindings>({
		meta: {
			menu: ["or", "gamepad.button.10", "KeyT", "Esc"],
			edtoggle: "Tab",
		},

		spectator: {
			spawn: "gamepad.button.any",
		},

		robot: {
			use: "gamepad.button.3",
			action1: "gamepad.axis.7.neg",
			action2: "gamepad.axis.8.neg",
			action3: "gamepad.button.6",
			action4: "gamepad.button.5",

			boost: ["or", "gamepad.button.11", "gamepad.button.4"],
			move_up: "gamepad.axis.2.pos",
			move_down: "gamepad.axis.2.neg",
			move_left: "gamepad.axis.1.pos",
			move_right: "gamepad.axis.1.neg",

			look_up: "gamepad.axis.6.pos",
			look_down: "gamepad.axis.6.neg",
			look_left: "gamepad.axis.5.pos",
			look_right: "gamepad.axis.5.neg",
		},
	})},

	micro: {label: "🦠micro", bindings: asBindings<typeof bindings>({
		meta: {
			menu: ["or", "gamepad.button.6", "KeyT", "Esc"],
			edtoggle: "Tab",
		},

		spectator: {
			spawn: "gamepad.button.any",
		},

		robot: {
			use: "gamepad.button.3",
			action1: "gamepad.axis.7.neg",
			action2: "gamepad.axis.8.neg",
			action3: "gamepad.button.6",
			action4: "gamepad.button.5",

			boost: ["or", "gamepad.button.11", "gamepad.button.4"],
			move_up: "gamepad.axis.2.pos",
			move_down: "gamepad.axis.2.neg",
			move_left: "gamepad.axis.1.pos",
			move_right: "gamepad.axis.1.neg",

			look_up: "null",
			look_down: "null",
			look_left: "null",
			look_right: "null",
		},
	})},
} satisfies Record<string, Profile>

