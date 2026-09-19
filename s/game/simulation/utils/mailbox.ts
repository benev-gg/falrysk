
export class Mailbox<X> {
	items: X[] = []

	give(item: X) {
		this.items.push(item)
	}

	take() {
		const {items} = this
		this.items = []
		return items
	}
}

