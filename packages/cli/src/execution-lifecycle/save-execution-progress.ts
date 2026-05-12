import { Logger } from '@resin/backend-common';
import { ExecutionRepository } from '@resin/db';
import { Container } from '@resin/di';
import { ErrorReporter } from 'resin-core';
import type { IRunExecutionData, ITaskData } from 'resin-workflow';

export async function saveExecutionProgress(
	workflowId: string,
	executionId: string,
	nodeName: string,
	_data: ITaskData,
	executionData: IRunExecutionData,
) {
	const logger = Container.get(Logger);
	const executionRepository = Container.get(ExecutionRepository);
	const errorReporter = Container.get(ErrorReporter);

	try {
		logger.debug(`Save execution progress to database for execution ID ${executionId} `, {
			executionId,
			nodeName,
		});

		executionData.resultData.lastNodeExecuted = nodeName;

		const updated = await executionRepository.updateExistingExecution(
			executionId,
			{ data: executionData, status: 'running' },
			{ requireNotFinished: true, requireNotCanceled: true },
		);

		if (!updated) {
			logger.debug(
				`Skipped saving execution progress to database for execution ID ${executionId} - execution already finished or canceled`,
				{ executionId, nodeName },
			);
		}
	} catch (e) {
		const error = e instanceof Error ? e : new Error(`${e}`);

		errorReporter.error(error);
		// TODO: Improve in the future!
		// Errors here might happen because of database access
		// For busy machines, we may get "Database is locked" errors.

		// We do this to prevent crashes and executions ending in `unknown` state.
		logger.error(
			`Failed saving execution progress to database for execution ID ${executionId} (hookFunctionsSaveProgress, nodeExecuteAfter)`,
			{ error, executionId, workflowId },
		);
	}
}
