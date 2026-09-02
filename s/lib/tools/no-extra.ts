
export type NoExtra<T, Shape> =
	T & Record<Exclude<keyof T, keyof Shape>, never>

