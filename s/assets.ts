
import {deep} from "@e280/stz"
import {consts} from "./consts.js"

export function asset(path: keyof typeof assets) {
	return `${consts.assets.origin}/${assets[path]}`
}

export const assets = deep.freeze({
	"favicon.png": "e8560a6d8a2819ace09bfe8450cf80d5aef266b7587f1ed470120ede781d36bd.png",
	"bg.webp": "1d4f3e88f72fb18c0ea2f37c664308659f1ebd6571871164f3ee10c7ec893351.webp",
})

