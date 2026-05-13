import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgLoader from 'vite-svg-loader';
import istanbul from 'vite-plugin-istanbul';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { codecovVitePlugin } from '@codecov/vite-plugin';

import { vitestConfig } from '@resin/vitest-config/frontend';
import icons from 'unplugin-icons/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import legacy from '@vitejs/plugin-legacy';
import browserslist from 'browserslist';
import { isLocaleFile, sendLocaleUpdate } from './vite/i18n-locales-hmr-helpers';
import { nodePopularityPlugin } from './vite/vite-plugin-node-popularity.mjs';

const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/';

const { NODE_ENV } = process.env;

const browsers = browserslist.loadConfig({ path: process.cwd() });

const packagesDir = resolve(__dirname, '..', '..');

const alias = [
	{ find: '@', replacement: resolve(__dirname, 'src') },
	{ find: 'stream', replacement: 'stream-browserify' },
	// Stub out @resin/expression-runtime for browser build (it pulls in isolated-vm, a Node.js-only native module)
	{
		find: '@resin/expression-runtime',
		replacement: resolve(__dirname, 'vite/expression-runtime-stub.ts'),
	},
	// Ensure bare imports resolve to sources (not dist)
	{ find: '@resin/i18n', replacement: resolve(packagesDir, 'frontend', '@resin', 'i18n', 'src') },
	{ find: '@resin/chat-hub', replacement: resolve(packagesDir, '@resin', 'chat-hub', 'src') },
	{ find: '@resin/tournament', replacement: resolve(packagesDir, '@resin', 'tournament', 'src') },
	{
		find: /^@resin\/chat(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'chat', 'src$1'),
	},
	{
		find: /^@resin\/chat-hub(.+)$/,
		replacement: resolve(packagesDir, '@resin', 'chat-hub', 'src$1'),
	},
	{
		find: /^@resin\/api-requests(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'api-requests', 'src$1'),
	},
	{
		find: /^@resin\/composables(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'composables', 'src$1'),
	},
	{
		find: /^@resin\/constants(.+)$/,
		replacement: resolve(packagesDir, '@resin', 'constants', 'src$1'),
	},
	{
		find: /^@resin\/design-system(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'design-system', 'src$1'),
	},
	{
		find: /^@resin\/i18n(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'i18n', 'src$1'),
	},
	{
		find: /^@resin\/stores(.+)$/,
		replacement: resolve(packagesDir, 'frontend', '@resin', 'stores', 'src$1'),
	},
	{
		find: /^@resin\/utils(.+)$/,
		replacement: resolve(packagesDir, '@resin', 'utils', 'src$1'),
	},
	...['orderBy', 'camelCase', 'cloneDeep', 'startCase'].map((name) => ({
		find: new RegExp(`^lodash.${name}$`, 'i'),
		replacement: `lodash/${name}`,
	})),
	{
		find: /^lodash\.(.+)$/,
		replacement: 'lodash/$1',
	},
	{
		// For sanitize-html
		find: 'source-map-js',
		replacement: resolve(__dirname, 'vite/source-map-js-shim'),
	},
];

const { RELEASE: release } = process.env;

const plugins: UserConfig['plugins'] = [
	nodePopularityPlugin(),
	icons({
		compiler: 'vue3',
		autoInstall: NODE_ENV === 'development',
	}),
	// Add istanbul coverage plugin for E2E tests
	...(process.env.BUILD_WITH_COVERAGE === 'true'
		? [
				istanbul({
					include: 'src/**/*',
					exclude: ['node_modules', 'tests/', 'dist/'],
					extension: ['.js', '.ts', '.vue'],
					forceBuildInstrument: true,
					requireEnv: false,
				}),
			]
		: []),
	viteStaticCopy({
		targets: [
			{
				src: 'node_modules/web-tree-sitter/tree-sitter.wasm',
				dest: '.',
				rename: { stripBase: true },
			},
			{
				src: 'node_modules/curlconverter/dist/tree-sitter-bash.wasm',
				dest: '.',
				rename: { stripBase: true },
			},
			// wa-sqlite WASM files for OPFS database support (no cross-origin isolation needed)
			{
				src: 'node_modules/wa-sqlite/dist/wa-sqlite.wasm',
				dest: 'assets',
			},
			{
				src: 'node_modules/wa-sqlite/dist/wa-sqlite-async.wasm',
				dest: 'assets',
			},
		],
	}),
	vue(),
	svgLoader({
		svgoConfig: {
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							// disable a default plugin
							cleanupIds: false,
							// preserve viewBox for scalability
							removeViewBox: false,
						},
					},
				},
			],
		},
	}),
	...(release
		? [
				legacy({
					modernTargets: browsers,
				}),
			]
		: []),
	{
		name: 'Insert config script',
		transformIndexHtml: (html, ctx) => {
			// Skip config tags when using Vite dev server. Otherwise the BE
			// will replace it with the actual config script in cli/src/commands/start.ts.
			return ctx.server
				? html
						.replace('%CONFIG_TAGS%', '')
						.replaceAll('/{{BASE_PATH}}', '//localhost:5678')
						.replaceAll('/{{REST_ENDPOINT}}', '/rest')
				: html;
		},
	},
	// For sanitize-html
	nodePolyfills({
		include: ['fs', 'path', 'url', 'util', 'timers'],
	}),
	{
		name: 'i18n-locales-hmr',
		configureServer(server) {
			const localesDir = resolve(packagesDir, 'frontend', '@resin', 'i18n', 'src', 'locales');
			server.watcher.add(localesDir);

			// Only emit for add/unlink; change events are handled in handleHotUpdate
			server.watcher.on('all', (event, file) => {
				if ((event === 'add' || event === 'unlink') && isLocaleFile(file)) {
					sendLocaleUpdate(server, file);
				}
			});
		},
		handleHotUpdate(ctx) {
			const { file, server } = ctx;
			if (!isLocaleFile(file)) return;
			sendLocaleUpdate(server, file);
			// Swallow default HMR for this file to prevent full page reloads
			return [];
		},
	},
	...(release
		? [
				sentryVitePlugin({
					org: 'n8nio',
					project: 'instance-frontend',
					authToken: process.env.SENTRY_AUTH_TOKEN,
					telemetry: false,
					release: {
						name: `n8n@${release}`,
					},
				}),
			]
		: []),
	// Only run on non-release builds to prevent double upload from @vitejs/plugin-legacy
	...(process.env.CODECOV_TOKEN && !release
		? [
				codecovVitePlugin({
					enableBundleAnalysis: true,
					bundleName: 'editor-ui',
					uploadToken: process.env.CODECOV_TOKEN,
					debug: true,
				}),
			]
		: []),
];

const target = browserslistToEsbuild(browsers);

export default mergeConfig(
	defineConfig({
		define: {
			// This causes test to fail but is required for actually running it
			// ...(NODE_ENV !== 'test' ? { 'global': 'globalThis' } : {}),
			...(NODE_ENV === 'development' ? { 'process.env': {} } : {}),
			BASE_PATH: `'${publicPath}'`,
		},
		plugins,
		resolve: { alias },
		base: publicPath,
		envPrefix: ['VUE', 'N8N_ENV_FEAT'],
		css: {
			preprocessorMaxWorkers: true,
			preprocessorOptions: {
				scss: {
					additionalData: [
						'',
						'@use "@/app/css/_variables.scss" as *;',
						'@use "@resin/design-system/css/mixins" as mixins;',
					].join('\n'),
				},
			},
		},
		build: {
			minify: !!release,
			sourcemap: !!release,
			target,
		},
		optimizeDeps: {
			exclude: ['wa-sqlite'],
			rolldownOptions: {},
		},
		worker: {
			format: 'es',
		},
	}),
	vitestConfig,
);
