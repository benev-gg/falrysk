
import {dom} from "@e280/sly"
import {got} from "@e280/stz"

export function getVersion() {
	return got(dom(`meta[name="version"]`).getAttribute("content"))
}

