
import {Entity} from "../types.js"

export function flattenEntities(entities: Entity[]) {
	const flat: Entity[] = []

	function crawl(e: Entity) {
		flat.push(e)
		e.children.forEach(crawl)
	}

	entities.forEach(crawl)
	return flat
}

