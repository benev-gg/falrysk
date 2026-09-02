
import {dedupe, got} from "@e280/stz"
import {AssetContainer} from "@babylonjs/lite"
import {Prop} from "./types.js"
import {isLight, isMesh, isTransform} from "./is.js"
import {flattenEntities} from "./internal/flatten-entities.js"

/** comfy access to the stuff inside an asset container */
export class AssetDepot {
	flat
	lights
	meshes
	transforms
	nodes
	materials
	props

	constructor(public container: AssetContainer) {
		this.flat = flattenEntities(container.entities)
		this.lights = this.flat.filter(isLight)
		this.meshes = this.flat.filter(isMesh)
		this.transforms = this.flat.filter(isTransform)
		this.nodes = [...this.transforms, ...this.meshes]
		this.materials = dedupe(this.meshes.map(m => m.material))
		this.props = new Map<string, Prop>(
			this.nodes.map(n => [n.name, n])
		)
	}

	prop(name: string) {
		return got(this.props.get(name), `prop "${name}" not found`)
	}

	mesh(name: string) {
		return got(this.meshes.find(n => n.name === name), `mesh "${name}" not found`)
	}

	transform(name: string) {
		return got(this.transforms.find(n => n.name === name), `transform "${name}" not found`)
	}

	material(name: string) {
		return got(this.materials.find(n => n.name === name), `material "${name}" not found`)
	}
}

