import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import dotenv from 'rollup-plugin-dotenv'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import routify from '@roxi/routify/plugins/rollup'
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		sourcemap: !production,
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
			emitCss: true, // give component style to postcss() for processing
			preprocess: autoPreprocess(),
		}),

		typescript({ sourceMap: !production }),
		nodePolyfills(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		includePaths({
			include: {},
			paths: ['src/components', 'src/data', 'src/helpers'],
			external: [],
			extensions: ['.js', '.ts']
		}),
		commonjs(),

		json(), // adds support for importing json files
		postcss({
			extract: true, // create a css file alongside the output.file
			sourceMap: production,
			use: {
				sass: {
					includePaths: ['node_modules']
				}
			},
		}),
		routify({
			dynamicImports: false,
		}),
		dotenv(),

		//           minify     auto-refresh browser on changes
		production ? terser() : livereload('dist'),

		// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW
		// generateSW({
		// 	additionalManifestEntries: [
		// 		'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap', // request for this generated in `components/mdc/index.js`
		// 		'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2', // this response might need to be tweaked periodically for the lastest version
		// 	],
		// 	globDirectory: 'dist',
		// 	globPatterns: ['**/*.{css,html,js,json,png}'],
		// 	navigateFallback: 'index.html',
		// 	offlineGoogleAnalytics: true,
		// 	swDest: 'dist/service-worker.js',
		// }),
	],
	watch: {
		clearScreen: false,
	}
}
