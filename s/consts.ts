
import {deep} from "@e280/stz"

export const consts = deep.freeze({
	world: {
		resolution: 512,
		size: 32_768,
		// size: 8192,
	},
	base: "https://benev.gg/falrysk",
	simulationHz: 60,
	workers: {
		render: "./renderer.worker.bundle.min.js",
	},
	assets: {
		local: "/assets",
		origin: "https://benev-space.tor1.digitaloceanspaces.com/falrysk/assets",
		cdn: "https://benev-space.tor1.cdn.digitaloceanspaces.com/falrysk/assets",
	},
})

