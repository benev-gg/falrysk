
import {router} from "@e280/sly"
import {Loader} from "@benev/web"
import {Basis} from "./types.js"
import {RenderZone} from "./parts/render-zone.js"

const loading = () => "loading..."

export const makeRouter = ({
		header, loader, getRunCount, getBasis,
	}: {
		header: RenderZone
		loader: Loader
		getRunCount: () => number
		getBasis: () => Promise<Basis>
	}) => router({

	"": async() => {
		if (getRunCount() === 1) return
		header.render(null)
		await loader.reset(loading)
		header.reset()
	},

	"play": async() => {
		await loader.load(loading, async() => {
			header.render(null)
			const [basis, mod] = await Promise.all([
				getBasis(),
				import("./parts/load-play.js"),
			])
			const View = await mod.default(basis)
			return View()
		})
	},
})

