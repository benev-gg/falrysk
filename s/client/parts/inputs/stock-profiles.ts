
import {asBindings, Profile} from "@benev/tact"
import {bindings} from "../../../game/simulation/parts/bindings.js"

export const stockProfiles = {
	standard: {label: "📜standard", bindings},

	xinput: {label: "🎮xinput", bindings: asBindings<typeof bindings>({
		amble: {
			use: "gamepad.button.3",
			sprint: ["or", "gamepad.button.11", "gamepad.button.4"],

			move_forward: "gamepad.axis.2.pos",
			move_backward: "gamepad.axis.2.neg",
			move_leftward: "gamepad.axis.1.pos",
			move_rightward: "gamepad.axis.1.neg",

			look_up: "gamepad.axis.6.pos",
			look_down: "gamepad.axis.6.neg",
			look_left: "gamepad.axis.5.pos",
			look_right: "gamepad.axis.5.neg",
		},
	})},

	micro: {label: "🦠micro", bindings: asBindings<typeof bindings>({
		amble: {
			use: "gamepad.button.3",
			sprint: ["or", "gamepad.button.11", "gamepad.button.4"],

			move_forward: "gamepad.axis.2.pos",
			move_backward: "gamepad.axis.2.neg",
			move_leftward: "gamepad.axis.1.pos",
			move_rightward: "gamepad.axis.1.neg",

			look_up: "null",
			look_down: "null",
			look_left: "null",
			look_right: "null",
		},
	})},
} satisfies Record<string, Profile>

