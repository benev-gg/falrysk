
import type {DirectionalLight, HemisphericLight, LightBase, Mesh, PointLight, SceneNode, SpotLight, TransformNode} from "@babylonjs/lite"

export type AnyCanvas = HTMLCanvasElement | OffscreenCanvas

/** a mesh or transform node, which can be cloned or instanced */
export type Prop = Mesh | TransformNode

/** the entities that an asset container presents */
export type Entity = SceneNode | LightBase

/** any kind of light node (not counting clustered lights) */
export type Light = PointLight | SpotLight | DirectionalLight | HemisphericLight

