
import {Orb} from "@e280/scute"
import {consts} from "../../consts.js"

export function canonicalUrl(orb: Orb) {
	const url = consts.base + orb.url('@/', true)
	return url.endsWith("/")
		? url
		: url + "/"
}

