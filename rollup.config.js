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
import outputManifest from 'rollup-plugin-output-manifest'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import html from '@rollup/plugin-html'

const production = !process.env.ROLLUP_WATCH

const getHtml = (script, css) => `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width,initial-scale=1'>
	<meta property="og:title" content="Cover" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://cover.sil.org/logo.svg" />
  <meta property="og:url" content="https://cover.sil.org/" />
	<title>Cover</title>

	<link rel='icon' type='image/svg+xml' href='/favicon.svg'>
	<link rel='alternate icon' type='image/png' href='/favicon.png' >
	<link href="/manifest.json" rel="manifest">
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
  ${css}
</head>

<body>
	  ${script}
</body>
</html>`

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'bundle.[hash].js',
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
      extensions: ['.js', '.ts'],
    }),
    commonjs(),

    json(), // adds support for importing json files
    postcss({
      extract: true, // create a css file alongside the output.file
      sourceMap: production,
      use: {
        sass: {
          includePaths: ['node_modules'],
        },
      },
    }),
    routify({
      dynamicImports: false,
    }),
    dotenv(),

    //           minify     auto-refresh browser on changes
    production ? terser() : livereload('dist'),
    outputManifest({
      fileName: 'bundle-manifest.json',
    }),
    html({
      template: async ({ attributes, files, meta, publicPath, title }) => {
        const script = (files.js || [])
          .map(({ fileName }) => {
            return `<script src='${fileName}'></script>`
          })
          .join('\n')

        const css = (files.css || [])
          .map(({ fileName }) => {
            return `<link rel='stylesheet' href='${fileName}'>`
          })
          .join('\n')
        return getHtml(script, css)
      }
    }),
  ],
  watch: {
    clearScreen: false,
  },
}
