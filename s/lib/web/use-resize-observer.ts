
import {debounce} from "@e280/stz"
import {useMount} from "@e280/sly"

export function useResizeObserver(element: HTMLElement, onResize: (rect: DOMRect) => void) {
	useMount(() => {
		const resize = debounce(100, () => onResize(element.getBoundingClientRect()))
		resize()
		const observer = new ResizeObserver(resize)
		observer.observe(element)
		return () => observer.disconnect()
	})
}

