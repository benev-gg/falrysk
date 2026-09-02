
import {Art} from "./art.js"

export type Artwork = Art | {[key: string]: Artwork}

