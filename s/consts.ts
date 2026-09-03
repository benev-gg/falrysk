
import {deep} from "@e280/stz"

export const consts = deep.freeze({
	simulationHz: {min: 10, max: 30},
	assets: {
		local: "/assets",
		origin: "https://benev-space.tor1.digitaloceanspaces.com/falrysk/assets",
		cdn: "https://benev-space.tor1.cdn.digitaloceanspaces.com/falrysk/assets",
	},
})

