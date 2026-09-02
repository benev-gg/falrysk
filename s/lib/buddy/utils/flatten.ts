
import {Prop} from "../types.js"

/** get a flat array of this prop and all its recursive children */
export function flatten(...props: Prop[]) {
	const collected = new Set<Prop>()

	function crawl(prop: Prop) {
		if (collected.has(prop))
			return

		collected.add(prop)

		for (const child of prop.children)
			crawl(child)
	}

	for (const prop of props)
		crawl(prop)

	return [...collected]
}

