
import {asBindings} from "@benev/tact"

export const bindings = asBindings({
	amble: {
		use: "KeyE",
		sprint: "ShiftLeft",

		move_forward: "KeyW",
		move_backward: "KeyS",
		move_leftward: "KeyA",
		move_rightward: "KeyD",

		look_up: ["or", "KeyI", "pointer.move.up"],
		look_down: ["or", "KeyK", "pointer.move.down"],
		look_left: ["or", "KeyJ", "pointer.move.left"],
		look_right: ["or", "KeyL", "pointer.move.right"],
	},
})

