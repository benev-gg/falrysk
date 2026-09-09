
import {router} from "@e280/sly"
import {Basis} from "./types.js"

const loading = () => "loading..."

export const makeRouter = ({
		basis,
		getRunCount,
	}: {
		basis: Basis
		getRunCount: () => number
	}) => router({

	"": async() => {
		if (getRunCount() === 1) return
		basis.benevHeader.render(null)
		await basis.benevLoader.reset(loading)
		basis.benevHeader.reset()
	},

	"play": async() => {
		await basis.benevLoader.load(loading, async() => {
			basis.benevHeader.render(null)
			const mod = await import("./parts/load-play.js")
			const View = await mod.default(basis)
			return View()
		})
	},
})

