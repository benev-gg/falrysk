
export type Catalog = {
	artGlb: ArrayBuffer
}

export async function makeCatalog(): Promise<Catalog> {
	return {artGlb: new ArrayBuffer()}
}

