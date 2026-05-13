import { createVitestConfig } from '@resin/vitest-config/node';

export default createVitestConfig({ include: ['test/**/test-*.ts', 'test/**/test-*.js'] });
