
import {html} from "lit"
import {Loader} from "@benev/web"
import {effect} from "@e280/strata"
import {hashNav, watchHash, router} from "@e280/sly"
import {Basis} from "../types.js"
import {RenderZone} from "./render-zone.js"

export function setupNavigation({header, loader, getBasis}: {
		menu: RenderZone
		header: RenderZone
		loader: Loader
		getBasis: () => Promise<Basis>
	}) {

	const $hash = watchHash()
	const loading = () => "loading..."

	const go = hashNav({
		home: () => ``,
		play: () => `play`,
	})

	let runs = 0

	const route = router({
		"": async() => {
			if (runs === 1) return
			await loader.load(loading, async() => {
				// menu.reset()
				header.render(null)
				return Array.from(loader.original.content.cloneNode(true).childNodes)
			}).then(() => header.reset())
		},

		"play": async() => {
			await loader.load(loading, async() => {
				header.render(null)
				const [basis, mod] = await Promise.all([
					getBasis(),
					import("./register-play.js"),
				])
				await mod.default(basis)
				return html`<game-play></game-play>`
			})
		},
	})

	effect(() => {
		runs++
		route($hash())
	})

	return {go}
}

