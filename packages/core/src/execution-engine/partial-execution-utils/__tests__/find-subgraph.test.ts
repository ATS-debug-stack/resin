// NOTE: Diagrams in this file have been created with https://asciiflow.com/#/
// If you update the tests, please update the diagrams as well.
// If you add a test, please create a new diagram.
//
// Map
// 0  means the output has no run data
// 1  means the output has run data
// ►► denotes the node that the user wants to execute to
// XX denotes that the node is disabled
// PD denotes that the node has pinned data

import { NodeConnectionTypes } from 'resin-workflow';

import { createNodeData } from './helpers';
import { DirectedGraph } from '../directed-graph';
import { findSubgraph } from '../find-subgraph';

describe('findSubgraph', () => {
	//                 ►►
	//  ┌───────┐     ┌───────────┐
	//  │trigger├────►│destination│
	//  └───────┘     └───────────┘
	test('simple', () => {
		const trigger = createNodeData({ name: 'trigger' });
		const destination = createNodeData({ name: 'destination' });

		const graph = new DirectedGraph()
			.addNodes(trigger, destination)
			.addConnections({ from: trigger, to: destination });

		const subgraph = findSubgraph({ graph, destination, trigger });

		expect(subgraph).toEqual(graph);
	});

	//                 ►►
	//                ┌──────┐
	//                │orphan│
	//                └──────┘
	//  ┌───────┐     ┌───────────┐
	//  │trigger├────►│destination│
	//  └───────┘     └───────────┘
	test('works with a single node', () => {
		const trigger = createNodeData({ name: 'trigger' });
		const destination = createNodeData({ name: 'destination' });
		const orphan = createNodeData({ name: 'orphan' });

		const graph = new DirectedGraph()
			.addNodes(trigger, destination, orphan)
			.addConnections({ from: trigger, to: destination });

		const subgraph = findSubgraph({ graph, destination: orphan, trigger: orphan });

		expect(subgraph).toEqual(new DirectedGraph().addNode(orphan));
	});

	//                     ►►
	//  ┌───────┐         ┌───────────┐
	//  │       ├────────►│           │
	//  │trigger│         │destination│
	//  │       ├────────►│           │
	//  └───────┘         └───────────┘
	test('multiple connections', () => {
		const ifNode = createNodeData({ name: 'If' });
		const noOp = createNodeData({ name: 'noOp' });

		const graph = new DirectedGraph()
			.addNodes(ifNode, noOp)
			.addConnections(
				{ from: ifNode, to: noOp, outputIndex: 0 },
				{ from: ifNode, to: noOp, outputIndex: 1 },
			);

		const subgraph = findSubgraph({ graph, destination: noOp, trigger: ifNode });

		expect(subgraph).toEqual(graph);
	});

	//                     ►►
	//  ┌───────┐         ┌───────────┐
	//  │       ├────────►│           │      ┌────┐
	//  │trigger│         │destination├─────►│node│
	//  │       ├────────►│           │      └────┘
	//  └───────┘         └───────────┘
	test('disregard nodes after destination', () => {
		const trigger = createNodeData({ name: 'trigger' });
		const destination = createNodeData({ name: 'destination' });
		const node = createNodeData({ name: 'node' });

		const graph = new DirectedGraph()
			.addNodes(trigger, destination, node)
			.addConnections({ from: trigger, to: destination }, { from: destination, to: node });

		const subgraph = findSubgraph({ graph, destination, trigger });

		expect(subgraph).toEqual(
			new DirectedGraph()
				.addNodes(trigger, destination)
				.addConnections({ from: trigger, to: destination }),
		);
	});

	//                                ►►
	//  ┌───────┐       ┌─────┐      ┌─────┐
	//  │Trigger├───┬──►│Node1├───┬─►│Node2│
	//  └───────┘   │   └─────┘   │  └─────┘
	//              │             │
	//              └─────────────┘
	test('terminates when called with graph that contains cycles', () => {
		// ARRANGE
		const trigger = createNodeData({ name: 'trigger' });
		const node1 = createNodeData({ name: 'node1' });
		const node2 = createNodeData({ name: 'node2' });
		const graph = new DirectedGraph()
			.addNodes(trigger, node1, node2)
			.addConnections(
				{ from: trigger, to: node1 },
				{ from: node1, to: node1 },
				{ from: node1, to: node2 },
			);

		// ACT
		const subgraph = findSubgraph({ graph, destination: node2, trigger });

		// ASSERT
		expect(subgraph).toEqual(graph);
	});

	//                ►►
	//  ┌───────┐     ┌─────┐
	//  │Trigger├──┬─►│Node1│
	//  └───────┘  │  └─────┘
	//             │
	//  ┌─────┐    │
	//  │Node2├────┘
	//  └─────┘
	test('terminates when called with graph that contains cycles', () => {
		// ARRANGE
		const trigger = createNodeData({ name: 'trigger' });
		const node1 = createNodeData({ name: 'node1' });
		const node2 = createNodeData({ name: 'node2' });
		const graph = new DirectedGraph()
			.addNodes(trigger, node1, node2)
			.addConnections({ from: trigger, to: node1 }, { from: node2, to: node1 });

		// ACT
		const subgraph = findSubgraph({ graph, destination: node1, trigger });

		// ASSERT
		expect(subgraph).toEqual(
			new DirectedGraph().addNodes(trigger, node1).addConnections({ from: trigger, to: node1 }),
		);
	});

	//                               ►►
	//  ┌───────┐    ┌───────────┐   ┌───────────┐
	//  │Trigger├─┬─►│Destination├──►│AnotherNode├───┐
	//  └───────┘ │  └───────────┘   └───────────┘   │
	//            │                                  │
	//            └──────────────────────────────────┘
	test('terminates if the destination node is part of a cycle', () => {
		// ARRANGE
		const trigger = createNodeData({ name: 'trigger' });
		const destination = createNodeData({ name: 'destination' });
		const anotherNode = createNodeData({ name: 'anotherNode' });
		const graph = new DirectedGraph()
			.addNodes(trigger, destination, anotherNode)
			.addConnections(
				{ from: trigger, to: destination },
				{ from: destination, to: anotherNode },
				{ from: anotherNode, to: destination },
			);

		// ACT
		const subgraph = findSubgraph({ graph, destination, trigger });

		// ASSERT
		expect(subgraph).toEqual(
			new DirectedGraph()
				.addNodes(trigger, destination)
				.addConnections({ from: trigger, to: destination }),
		);
	});

	describe('root nodes', () => {
		//                 ►►
		//  ┌───────┐      ┌───────────┐
		//  │trigger├─────►│destination│
		//  └───────┘      └──▲────────┘
		//                    │AiLanguageModel
		//                   ┌┴──────┐
		//                   │aiModel│
		//                   └───────┘
		test('always retain connections that have a different type than `NodeConnectionTypes.Main`', () => {
			// ARRANGE
			const trigger = createNodeData({ name: 'trigger' });
			const destination = createNodeData({ name: 'destination' });
			const aiModel = createNodeData({ name: 'ai_model' });

			const graph = new DirectedGraph()
				.addNodes(trigger, destination, aiModel)
				.addConnections(
					{ from: trigger, to: destination },
					{ from: aiModel, type: NodeConnectionTypes.AiLanguageModel, to: destination },
				);

			// ACT
			const subgraph = findSubgraph({ graph, destination, trigger });

			// ASSERT
			expect(subgraph).toEqual(graph);
		});

		// This graph is not possible, it's only here to make sure `findSubgraph`
		// does not follow non-Main connections.
		//
		//  ┌────┐   ┌───────────┐
		//  │root┼───►destination│
		//  └──▲─┘   └───────────┘
		//     │AiLanguageModel
		//    ┌┴──────┐
		//    │aiModel│
		//    └▲──────┘
		//    ┌┴──────┐
		//    │trigger│
		//    └───────┘
		// turns into an empty graph, because there is no `Main` typed connection
		// connecting destination and trigger.
		test('skip non-Main connection types', () => {
			// ARRANGE
			const trigger = createNodeData({ name: 'trigger' });
			const root = createNodeData({ name: 'root' });
			const aiModel = createNodeData({ name: 'aiModel' });
			const destination = createNodeData({ name: 'destination' });
			const graph = new DirectedGraph()
				.addNodes(trigger, root, aiModel, destination)
				.addConnections(
					{ from: trigger, to: aiModel },
					{ from: aiModel, type: NodeConnectionTypes.AiLanguageModel, to: root },
					{ from: root, to: destination },
				);

			// ACT
			const subgraph = findSubgraph({ graph, destination, trigger });

			// ASSERT
			expect(subgraph.getConnections()).toHaveLength(0);
			expect(subgraph.getNodes().size).toBe(0);
		});

		//  ┌───────┐            ┌───────────┐
		//  │trigger├────────────►destination│
		//  └───────┘            └───────────┘
		//
		//                ┌───────┐
		//                │aiModel│
		//                └───────┘
		// turns into
		//  ┌───────┐            ┌───────────┐
		//  │trigger├────────────►destination│
		//  └───────┘            └───────────┘
		test('remove orphaned nodes', () => {
			// ARRANGE
			const trigger = createNodeData({ name: 'trigger' });
			const aiModel = createNodeData({ name: 'ai_model' });
			const destination = createNodeData({ name: 'destination' });

			const graph = new DirectedGraph()
				.addNodes(trigger, aiModel, destination)
				.addConnections({ from: trigger, to: destination });

			// ACT
			const subgraph = findSubgraph({ graph, destination, trigger });

			// ASSERT
			expect(subgraph).toEqual(
				new DirectedGraph()
					.addNodes(trigger, destination)
					.addConnections({ from: trigger, to: destination }),
			);
		});
	});
});
