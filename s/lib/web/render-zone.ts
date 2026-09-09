
import {Content, dom} from "@e280/sly"

export class RenderZone {
	#original

	constructor(public element: HTMLElement) {
		this.#original = document.createElement("template")
		this.#original.content.append(...Array.from(element.childNodes))
		this.reset()
	}

	render(content: Content) {
		dom.render(this.element, content)
	}

	reset() {
		this.render(
			Array.from(this.#original.content.cloneNode(true).childNodes)
		)
	}
}

