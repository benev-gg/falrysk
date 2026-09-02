
export function* limit<T>(n: number, iterable: Iterable<T>): Iterable<T> {
	let i = 0
	for (const item of iterable) {
		if (i++ >= n) break
		yield item
	}
}

