
import {asBindings} from "@benev/tact"

export const bindings = asBindings({
	meta: {
		menu: "KeyT",
		edtoggle: "Tab",
	},

	spectator: {
		spawn: "keyboard.any",
	},

	robot: {
		use: "KeyF",
		action1: ["or", "pointer.button.left", "Space"],
		action2: ["or", "pointer.button.right", "Semicolon"],
		action3: "KeyE",
		action4: "KeyQ",

		boost: "ShiftLeft",
		move_up: "KeyW",
		move_down: "KeyS",
		move_left: "KeyA",
		move_right: "KeyD",

		look_up: "KeyI",
		look_down: "KeyK",
		look_left: "KeyJ",
		look_right: "KeyL",
	},
})

