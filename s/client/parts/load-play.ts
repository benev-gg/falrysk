
import {Basis} from "../types.js"
import {Play} from "../views/play/view.js"
import {startDirector} from "./director.js"

export default async function(basis: Basis) {
	const director = await startDirector(basis)
	return Play(basis, director)
}

