
export function one<T>(iterable: Iterable<T>): T {
	const iter = iterable[Symbol.iterator]()
	const {value, done} = iter.next()
	if (done) throw new Error("required one iteration")
	return value
}

