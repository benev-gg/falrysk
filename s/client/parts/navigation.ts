
import {effect} from "@e280/strata"
import {hashNav, watchHash} from "@e280/sly"
import {Basis} from "../types.js"
import {makeRouter} from "../routes.js"

export function setupNavigation(basis: Basis) {
	const $hash = watchHash()

	const go = hashNav({
		home: () => ``,
		play: () => `play`,
	})

	let runs = 0

	const route = makeRouter({
		basis,
		getRunCount: () => runs,
	})

	effect(() => {
		runs++
		route($hash())
	})

	return {go}
}

