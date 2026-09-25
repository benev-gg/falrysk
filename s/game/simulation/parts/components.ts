
import {Quat, Vec2, Vec3, Vec4} from "@benev/math"
import {asComponent, vec2, vec3, vec4} from "@benev/archimedes"

export const bvec2 = asComponent<Vec2>({
	size: vec2.size,
	version: "12c957d0aaebbe68d40d63c8b84adb68",
	read: bytes => Vec2.from(vec2.read(bytes)),
	write: (bytes, value) => vec2.write(bytes, value.array()),
})

export const bvec3 = asComponent<Vec3>({
	size: vec3.size,
	version: "ba2b6b2f25c9cc542bb9b5580347cb5e",
	read: bytes => Vec3.from(vec3.read(bytes)),
	write: (bytes, value) => vec3.write(bytes, value.array()),
})

export const bvec4 = asComponent<Vec4>({
	size: vec4.size,
	version: "5dd42b48dff6e4af40c4b4dd21c33230",
	read: bytes => Vec4.from(vec4.read(bytes)),
	write: (bytes, value) => vec4.write(bytes, value.array()),
})

export const bquat = asComponent<Quat>({
	size: vec4.size,
	version: "29a8c02d95d50bbcfd61508f092980c8",
	read: bytes => Quat.from(vec4.read(bytes)),
	write: (bytes, value) => vec4.write(bytes, value.array()),
})

