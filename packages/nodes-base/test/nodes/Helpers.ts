import get from 'lodash/get';
import { constructExecutionMetaData } from 'resin-core';
import type {
	IDataObject,
	IExecuteFunctions,
	IGetNodeParameterOptions,
	INode,
} from 'resin-workflow';

export const createMockExecuteFunction = <T = IExecuteFunctions>(
	nodeParameters: IDataObject,
	nodeMock: INode,
	continueBool = false,
) =>
	({
		getNodeParameter(
			parameterName: string,
			_itemIndex: number,
			fallbackValue?: IDataObject,
			options?: IGetNodeParameterOptions,
		) {
			const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
			return get(nodeParameters, parameter, fallbackValue);
		},
		getNode() {
			return nodeMock;
		},
		getWorkflow() {
			return { id: 'test-workflow-id', name: 'Test Workflow', active: false };
		},
		continueOnFail() {
			return continueBool;
		},
		helpers: {
			constructExecutionMetaData,
		},
	}) as unknown as T;
