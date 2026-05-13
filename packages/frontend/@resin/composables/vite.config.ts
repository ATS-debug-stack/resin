import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@resin/vitest-config/frontend';

export default mergeConfig(defineConfig({}), vitestConfig);
