import type { AiEvent, IDataObject, IExecuteFunctions, ISupplyDataFunctions } from 'resin-workflow';
import { jsonStringify } from 'resin-workflow';

export function logAiEvent(
	executeFunctions: IExecuteFunctions | ISupplyDataFunctions,
	event: AiEvent,
	data?: IDataObject,
) {
	try {
		executeFunctions.logAiEvent(event, data ? jsonStringify(data) : undefined);
	} catch (error) {
		executeFunctions.logger.debug(`Error logging AI event: ${event}`);
	}
}
