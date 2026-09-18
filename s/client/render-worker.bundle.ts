
import {workerize} from "@e280/renraku/web"
import {setupRenderWorker} from "../game/renderer/worker.js"

await workerize({
	fns: setupRenderWorker(),
	exposeAllErrors: true,
})

