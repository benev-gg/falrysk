
import {Id} from "@benev/archimedes"
import {guarantee, need} from "@e280/stz"
import {PhysicsBody} from "./physics-body.js"
import {Lattice, Rect, Vec2} from "@benev/math"

export class Physics {
	#registry = new Map<Id, PhysicsBody>()
	#lattice = new Lattice<PhysicsBody>(new Vec2(8, 8))

	upsert(id: Id, rect: Rect, mass: number | undefined) {
		const body = guarantee(this.#registry, id, () => {
			const body = new PhysicsBody(id, rect, mass)
			this.#lattice.upsert(body, rect)
			return body
		})

		body.mass = mass

		if (!body.rect.equals(rect)) {
			body.rect = rect
			this.#lattice.upsert(body, rect)
		}

		return body
	}

	requireBody(id: Id) {
		return need(this.#registry, id)
	}
}

