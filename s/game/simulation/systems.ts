
import {consolidate} from "@benev/archimedes"
import {Pod} from "./parts/pod.js"
import {timing_update} from "./systems/timing_update.js"

export const systems = (pod: Pod) => consolidate(pod, {
	clock: {
		timing_update,
	},

	// gridworld: {
	// 	hologrid_lifecycle,
	// 	hologrid_chunks,
	// },
	//
	// controls: {
	// 	ingest_player_intents,
	// 	player_spawning,
	// 	wish_mover,
	// 	wish_interactor,
	// 	wish_actions,
	// },
	//
	// mech: {
	// 	mech_mobility,
	// 	mech_aiming,
	// 	mech_sync_inventory_capacity,
	// },
	//
	// gameplay: {
	// 	target_lattice,
	// 	target_assignment,
	// 	item_pickups,
	// 	item_drops,
	// 	item_equip_mech_chassis,
	// 	item_contained,
	// },
	//
	// physics: {
	// 	gridchunk_physics,
	// 	physics_bodies,
	// 	physical_forces,
	// },
})

