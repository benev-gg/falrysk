
import {deep} from "@e280/stz"

export const consts = deep.freeze({
	simulationHz: {min: 10, max: 30},
	assets: {
		local: "/assets",
		origin: "https://benev-storage.sfo2.digitaloceanspaces.com/falrysk/assets",
		cdn: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/falrysk/assets",
	},
})

