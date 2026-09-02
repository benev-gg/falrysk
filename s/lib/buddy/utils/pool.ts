
import {count} from "@e280/stz"

export type PoolMember<Item> = {
	item: Item
	enable: () => void
	disable: () => void
}

export class Pool<Item> {
	#make
	#free = new Set<PoolMember<Item>>()
	#used = new Set<PoolMember<Item>>()

	constructor(make: () => PoolMember<Item>) {
		this.#make = make
	}

	get size() {
		return this.#free.size + this.#used.size
	}

	prepopulate(n: number) {
		for (const _ of count(n)) {
			const member = this.#make()
			this.#free.add(member)
			member.disable()
		}
		return this
	}

	lease() {
		const member = this.#free.values().next().value ?? this.#make()
		this.#free.delete(member)
		this.#used.add(member)
		member.enable()

		let released = false

		const release = () => {
			if (released) return
			this.#free.add(member)
			this.#used.delete(member)
			member.disable()
			released = true
		}

		return [member.item, release] as [
			item: Item,
			release: () => void,
		]
	}
}

