
import {Basis} from "../types.js"
import {Play} from "../views/play/view.js"
import {makeDirector} from "./director/director.js"

export default async function(basis: Basis) {
	const director = await makeDirector(basis)
	return Play(director)
}

