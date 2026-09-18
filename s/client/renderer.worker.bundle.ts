
import {workerize} from "@e280/renraku/web"
import {setupRenderer} from "../game/renderer/renderer.js"

await workerize({
	fns: setupRenderer(),
	exposeAllErrors: true,
})

