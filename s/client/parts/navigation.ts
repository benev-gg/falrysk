
import {Loader} from "@benev/web"
import {effect} from "@e280/strata"
import {hashNav, watchHash} from "@e280/sly"
import {Basis} from "../types.js"
import {makeRouter} from "../routes.js"
import {RenderZone} from "./render-zone.js"

export function setupNavigation({header, loader, getBasis}: {
		menu: RenderZone
		header: RenderZone
		loader: Loader
		getBasis: () => Promise<Basis>
	}) {

	const $hash = watchHash()

	const go = hashNav({
		home: () => ``,
		play: () => `play`,
	})

	let runs = 0

	const route = makeRouter({
		header,
		loader,
		getBasis,
		getRunCount: () => runs,
	})

	effect(() => {
		runs++
		route($hash())
	})

	return {go}
}

