import type { AllEntities } from 'resin-workflow';

type NodeMap = {
	text: 'message';
	image: 'generate';
	video: 'textToVideo' | 'imageToVideo';
	audio: 'textToSpeech';
};

export type MiniMaxType = AllEntities<NodeMap>;
