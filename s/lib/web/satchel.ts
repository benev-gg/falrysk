
import {idbOpen, Kv, StorageMagazine} from "@e280/kv"

/** namespaced browser storage bucket (similar to the storage buckets api) */
export class Satchel {
	kv

	constructor(public readonly prefix: string) {
		const magazine = new StorageMagazine(window.localStorage)
		this.kv = new Kv(magazine).scope(this.prefix)
	}

	async opfs() {
		const directory = await navigator.storage.getDirectory()
		return directory.getDirectoryHandle(this.prefix, {create: true})
	}

	async idb(storeName: string) {
		return idbOpen(this.prefix, storeName)
	}
}

