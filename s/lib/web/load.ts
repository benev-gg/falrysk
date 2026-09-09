
export async function load(url: string | URL) {
	const response = await fetch(url)
	return response.arrayBuffer()
}

