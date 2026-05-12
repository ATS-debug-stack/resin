import { RuleTester } from '@typescript-eslint/rule-tester';

import { ValidPeerDependenciesRule } from './valid-peer-dependencies.js';

const ruleTester = new RuleTester();

ruleTester.run('valid-peer-dependencies', ValidPeerDependenciesRule, {
	valid: [
		{
			name: 'only resin-workflow with "*"',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*" } }',
		},
		{
			name: 'resin-workflow and ai-node-sdk',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "ai-node-sdk": "*" } }',
		},
		{
			name: 'resin-workflow and ai-node-sdk with a version range (ai-node-sdk shape is checked by ai-node-package-json rule)',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "ai-node-sdk": "^1.0.0" } }',
		},
		{
			name: 'non-package.json file is ignored',
			filename: 'some-config.json',
			code: '{ "peerDependencies": { "resin-core": "*" } }',
		},
		{
			name: 'nested objects are not checked',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*" }, "config": { "peerDependencies": { "resin-core": "*" } } }',
		},
	],
	invalid: [
		{
			name: 'missing peerDependencies section entirely',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "version": "1.0.0" }',
			output:
				'{ "name": "resin-nodes-example", "version": "1.0.0", "peerDependencies": { "resin-workflow": "*" } }',
			errors: [{ messageId: 'missingPeerDependencies' }],
		},
		{
			name: 'empty peerDependencies section',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": {} }',
			output: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*" } }',
			errors: [{ messageId: 'missingN8nWorkflow' }],
		},
		{
			name: 'peerDependencies missing resin-workflow but has ai-node-sdk',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "ai-node-sdk": "*" } }',
			output:
				'{ "name": "resin-nodes-example", "peerDependencies": { "ai-node-sdk": "*", "resin-workflow": "*" } }',
			errors: [{ messageId: 'missingN8nWorkflow' }],
		},
		{
			name: 'resin-workflow pinned to a specific version',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "^1.0.0" } }',
			output: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*" } }',
			errors: [{ messageId: 'pinnedN8nWorkflow', data: { value: '"^1.0.0"' } }],
		},
		{
			name: 'forbidden n8n-core peer dependency (CNOC-404 Sinch)',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "resin-core": "*" } }',
			errors: [{ messageId: 'forbiddenPeerDependency', data: { name: 'resin-core' } }],
		},
		{
			name: 'forbidden arbitrary peer dependency',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "lodash": "^4.0.0" } }',
			errors: [{ messageId: 'forbiddenPeerDependency', data: { name: 'lodash' } }],
		},
		{
			name: 'multiple forbidden peer dependencies reported separately',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "resin-core": "*", "axios": "^1.0.0" } }',
			errors: [
				{ messageId: 'forbiddenPeerDependency', data: { name: 'resin-core' } },
				{ messageId: 'forbiddenPeerDependency', data: { name: 'axios' } },
			],
		},
		{
			name: 'completely empty package.json gets peerDependencies inserted',
			filename: 'package.json',
			code: '{}',
			output: '{ "peerDependencies": { "resin-workflow": "*" } }',
			errors: [{ messageId: 'missingPeerDependencies' }],
		},
		{
			name: 'resin-workflow value is a non-literal (object) — not auto-fixable',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": { "version": "*" } } }',
			errors: [{ messageId: 'pinnedN8nWorkflow', data: { value: 'non-literal' } }],
		},
		{
			name: 'peerDependencies is a string instead of an object',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": "resin-workflow" }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'peerDependencies is an array instead of an object',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": ["resin-workflow"] }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'peerDependencies is null',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": null }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'pinned resin-workflow combined with forbidden entry',
			filename: 'package.json',
			code: '{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "1.0.0", "resin-core": "*" } }',
			output:
				'{ "name": "resin-nodes-example", "peerDependencies": { "resin-workflow": "*", "resin-core": "*" } }',
			errors: [
				{ messageId: 'pinnedN8nWorkflow', data: { value: '"1.0.0"' } },
				{ messageId: 'forbiddenPeerDependency', data: { name: 'resin-core' } },
			],
		},
	],
});
