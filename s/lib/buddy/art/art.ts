
import {Artwork} from "./types.js"

/** declared art prop should be available for instancing */
export class Art {
	constructor(
		public readonly name: string,
		public readonly population: number,
	) {}

	static new = (name: string, population: number) => new this(name, population)

	static collect = (artwork: Artwork) => {
		const array: Art[] = []
		function crawl(a: Artwork) {
			if (a instanceof Art) array.push(a)
			else Object.values(a).forEach(crawl)
		}
		crawl(artwork)
		return array
	}
}

