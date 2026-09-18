
import {deep} from "@e280/stz"

export const consts = deep.freeze({
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

