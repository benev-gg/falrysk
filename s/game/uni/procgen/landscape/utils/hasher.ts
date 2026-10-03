
import {guarantee, hash32} from "@e280/stz"

export function makeHasher(...entropy: (number | string)[]) {
	const map = new Map<string, number>()
	return (key: string) => guarantee(map, key, () => hash32(...entropy, key))
}

