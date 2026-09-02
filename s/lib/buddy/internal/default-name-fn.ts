
import {makeId} from "@benev/archimedes"
import {Prop} from "../types.js"

export const defaultNameFn = (prop: Prop) => `${prop.name}.${makeId()}`

