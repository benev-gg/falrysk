
import {Portal} from "@e280/renraku"
import {acceptWorkerPort, webAutoTransfer} from "@e280/renraku/web"
import {RenderWorkerFns} from "./types.js"

export async function makeRenderWorker() {
	const url = new URL("./render-worker.bundle.min.js", import.meta.url)
	const worker = new Worker(url, {type: "module"})
	const port = await acceptWorkerPort(worker)
	const portal = new Portal<RenderWorkerFns>({port, autoTransfer: webAutoTransfer})
	const {remote} = portal
	const dispose = () => {
		worker.terminate()
		portal.close()
	}
	return {remote, dispose}
}

