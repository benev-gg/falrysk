
import {deep} from "@e280/stz"

export const consts = deep.freeze({
	world: {
		resolution: 1024,
		size: 65_536,
		// size: 32_768,
		// size: 4_096,
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

