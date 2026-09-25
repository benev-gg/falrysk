
// export type Simulator = ReturnType<typeof setupSimulator>
//
// export function setupSimulator() {
// 	const inputs = new Inputs()
// 	const deltas = new Mailbox<Delta<GameComponents>>()
// 	const entities = new Entities<GameComponents>()
// 	const change = new Change<GameComponents>(delta => {
// 		applyDelta(entities, delta)
// 		deltas.give(delta)
// 	})
//
// 	const pod = new Pod(entities.readonly, change)
// 	const runSystems = setupSimulationSystems(pod)
//
// 	return {
// 		async simulate(playerIntents: PlayerIntent[]) {
// 			inputs.ingest(pod.actions, playerIntents)
// 			runSystems()
// 			return deltas.take()
// 		},
//
// 		async applyDeltas(deltas: Delta<GameComponents>[]) {
// 			for (const delta of deltas)
// 				applyDelta(entities, delta)
// 		},
//
// 		async snapshot() {
// 			return [...entities.entries()]
// 		},
// 	}
// }
//
