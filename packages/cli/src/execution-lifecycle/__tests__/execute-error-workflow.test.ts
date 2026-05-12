import { Logger } from '@resin/backend-common';
import { mockInstance } from '@resin/backend-test-utils';
import { GlobalConfig } from '@resin/config';
import { Container } from '@resin/di';
import { mock } from 'jest-mock-extended';
import { ErrorReporter } from 'resin-core';
import type { INode, IRun, IWorkflowBase } from 'resin-workflow';
import { createRunExecutionData, NodeOperationError } from 'resin-workflow';

import { OwnershipService } from '@/services/ownership.service';
import { UrlService } from '@/services/url.service';
import { WorkflowExecutionService } from '@/workflows/workflow-execution.service';

import { executeErrorWorkflow } from '../execute-error-workflow';

describe('executeErrorWorkflow', () => {
	mockInstance(Logger);
	mockInstance(ErrorReporter);
	const globalConfig = mockInstance(GlobalConfig);
	const urlService = mockInstance(UrlService);
	const ownershipService = mockInstance(OwnershipService);
	const workflowExecutionService = mockInstance(WorkflowExecutionService);

	Container.set(GlobalConfig, globalConfig);
	Container.set(UrlService, urlService);
	Container.set(OwnershipService, ownershipService);
	Container.set(WorkflowExecutionService, workflowExecutionService);

	const mockNode = mock<INode>({
		name: 'TestNode',
		type: 'resin-nodes-base.set',
		typeVersion: 1,
		position: [0, 0],
		parameters: {},
	});

	beforeEach(() => {
		jest.resetAllMocks();
		globalConfig.nodes = mock<GlobalConfig['nodes']>({
			errorTriggerType: 'resin-nodes-base.errorTrigger',
		});
	});

	describe('pastExecutionUrl', () => {
		it('should use getInstanceBaseUrl for pastExecutionUrl', () => {
			const mockInstanceBaseUrl = 'https://editor.example.com';
			urlService.getInstanceBaseUrl.mockReturnValue(mockInstanceBaseUrl);

			const workflowData = mock<IWorkflowBase>({
				id: 'workflow-123',
				name: 'Test Workflow',
				settings: { errorWorkflow: 'error-workflow-456' },
				nodes: [],
			});

			const testError = new NodeOperationError(mockNode, 'Test error');
			const fullRunData: IRun = {
				data: createRunExecutionData({
					resultData: {
						error: testError,
						lastNodeExecuted: 'TestNode',
						runData: {},
					},
				}),
				mode: 'trigger',
				startedAt: new Date(),
				storedAt: 'db',
				status: 'error',
			};

			const mockProject = { id: 'project-123' };
			ownershipService.getWorkflowProjectCached.mockResolvedValue(mockProject as never);
			workflowExecutionService.executeErrorWorkflow.mockResolvedValue(undefined);

			executeErrorWorkflow(workflowData, fullRunData, 'trigger', 'execution-789');

			expect(urlService.getInstanceBaseUrl).toHaveBeenCalled();
		});

		it('should construct correct pastExecutionUrl format with instanceBaseUrl', async () => {
			const mockInstanceBaseUrl = 'https://editor.example.com';
			urlService.getInstanceBaseUrl.mockReturnValue(mockInstanceBaseUrl);

			const workflowData = mock<IWorkflowBase>({
				id: 'workflow-123',
				name: 'Test Workflow',
				settings: { errorWorkflow: 'error-workflow-456' },
				nodes: [],
			});

			const testError = new NodeOperationError(mockNode, 'Test error');
			const fullRunData: IRun = {
				data: createRunExecutionData({
					resultData: {
						error: testError,
						lastNodeExecuted: 'TestNode',
						runData: {},
					},
				}),
				mode: 'trigger',
				startedAt: new Date(),
				storedAt: 'db',
				status: 'error',
			};

			const mockProject = { id: 'project-123' };
			ownershipService.getWorkflowProjectCached.mockResolvedValue(mockProject as never);

			let capturedWorkflowErrorData: unknown;
			workflowExecutionService.executeErrorWorkflow.mockImplementation(
				async (_errorWorkflow, workflowErrorData) => {
					capturedWorkflowErrorData = workflowErrorData;
				},
			);

			executeErrorWorkflow(workflowData, fullRunData, 'trigger', 'execution-789');

			// Wait for async operations
			await new Promise(process.nextTick);

			expect(capturedWorkflowErrorData).toMatchObject({
				execution: {
					id: 'execution-789',
					url: 'https://editor.example.com/workflow/workflow-123/executions/execution-789',
				},
			});
		});
	});
});
