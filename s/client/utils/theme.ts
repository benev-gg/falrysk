
import {is} from "@e280/stz"

export const themeCss = (
	Array.from(document.querySelectorAll<HTMLStyleElement>("style[data-theme]"))
		.filter(is.happy)
		.map(element => {
			const sheet = new CSSStyleSheet()
			sheet.replaceSync(element.textContent ?? "")
			return sheet
		})
)

