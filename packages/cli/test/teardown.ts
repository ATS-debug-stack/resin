import 'tsconfig-paths/register';
import { testDb } from '@resin/backend-test-utils';
import { GlobalConfig } from '@resin/config';
import { Container } from '@resin/di';
import { DataSource as Connection } from '@n8n/typeorm';

export default async () => {
	const { type: dbType } = Container.get(GlobalConfig).database;
	if (dbType !== 'postgresdb') return;

	const connection = new Connection(testDb.getBootstrapDBOptions());
	await connection.initialize();

	const query = 'SELECT datname as "Database" FROM pg_database';
	const results: Array<{ Database: string }> = await connection.query(query);
	const databases = results
		.filter(({ Database: dbName }) => dbName.startsWith(testDb.testDbPrefix))
		.map(({ Database: dbName }) => dbName);

	const promises = databases.map(
		async (dbName) => await connection.query(`DROP DATABASE ${dbName};`),
	);
	await Promise.all(promises);
	await connection.destroy();
};
