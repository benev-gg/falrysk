
import {Vec2} from "@benev/math"
import {rand32} from "@e280/stz"
import {makeId} from "@benev/archimedes"
import {consts} from "../../consts.js"
import {Simulation} from "./simulation.js"

export function initializeSimulation(simulation: Simulation) {
	simulation.entities.set(makeId(), {
		landscape: {
			seed: rand32(),
			size: Vec2.all(consts.world.size),
		},
	})
}

