
import {Actions, Intent, makeActionsResolver} from "@benev/tact"
import {bindings} from "./parts/bindings.js"

export type PlayerId = string
export type GameActions = Actions<typeof bindings>
export type GameActionsResolver = ReturnType<typeof makeActionsResolver<typeof bindings>>
export type PlayerIntent = [playerId: PlayerId, intents: Intent[]]

