import { Service } from '@resin/di';
import { DataSource, Repository } from '@resin/typeorm';

import { ExecutionAnnotation } from '../entities';

@Service()
export class ExecutionAnnotationRepository extends Repository<ExecutionAnnotation> {
	constructor(dataSource: DataSource) {
		super(ExecutionAnnotation, dataSource.manager);
	}
}
