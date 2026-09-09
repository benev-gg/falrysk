
export function onStorageEvent(
		fn: (key: string | null, storageArea: Storage | null) => void
	) {

	function listener(event: StorageEvent) {
		fn(event.key, event.storageArea)
	}

	window.addEventListener("storage", listener)
	return () => window.removeEventListener("storage", listener)
}

