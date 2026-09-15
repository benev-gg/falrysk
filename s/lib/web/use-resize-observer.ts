
import {debounce} from "@e280/stz"
import {useMount, useOnce, useRendered} from "@e280/sly"

export function useResizeObserver(element: HTMLElement, onResize: (rect: DOMRect) => void) {
	const resize = useOnce(() => () => onResize(element.getBoundingClientRect()))

	useRendered().then(resize)

	useMount(() => {
		const resizeDebounced = debounce(100, resize)
		resizeDebounced()
		const observer = new ResizeObserver(resizeDebounced)
		observer.observe(element)
		return () => observer.disconnect()
	})
}

