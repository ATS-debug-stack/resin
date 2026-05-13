import type { AllEntities } from 'resin-workflow';

type NodeMap = {
	text: 'message';
	image: 'analyze';
};

export type MoonshotType = AllEntities<NodeMap>;
