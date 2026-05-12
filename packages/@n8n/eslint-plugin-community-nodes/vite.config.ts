import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@resin/vitest-config/node';

export default mergeConfig(defineConfig({}), vitestConfig);
