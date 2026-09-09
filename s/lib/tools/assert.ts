
import {is} from "@e280/stz"

export function assert<Value>(value: Value, message?: string): NonNullable<Value> {
	if (!is.happy(value)) throw new Error(message ?? "assertion failed")
	return value
}

