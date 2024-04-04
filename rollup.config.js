import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import includePaths from 'rollup-plugin-includepaths'
import dotenv from 'rollup-plugin-dotenv'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import routify from '@roxi/routify/plugins/rollup.js'
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import html from '@rollup/plugin-html'

const production = !process.env.ROLLUP_WATCH

//Todo: fix these warnings if possible then remove from filter
const warnFilters = ['A11y: noninteractive element cannot have nonnegative tabIndex value']

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    entryFileNames: 'bundle.[hash].js',
    format: 'iife',
    sourcemap: !production,
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onwarn: (warning, next) => {
    if (warnFilters.includes(warning.message)) return // you can do this now btw
    next(warning)
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
      plugins: [
        require('postcss-import'),
        require('@tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }),
    routify({
      dynamicImports: false,
    }),
    dotenv(),

    //           minify     auto-refresh browser on changes
    production ? terser() : livereload('dist'),
    html({
      template: ({ files }) => {
        const script = (files.js || []).map(({ fileName }) => `<script src='/${fileName}'></script>`).join('\n')

        const css = (files.css || []).map(({ fileName }) => `<link rel='stylesheet' href='/${fileName}'>`).join('\n')
        return getHtml(script, css)
      },
    }),
  ],
  watch: {
    clearScreen: false,
  },
}

function getHtml(script, css) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <meta property="og:title" content="Cover" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://cover.sil.org/logo.svg" />
    <meta property="og:url" content="https://cover.sil.org/" />
    <title>Cover</title>

    <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
    <link rel='alternate icon' type='image/png' href='/favicon.png' />
    <link href="/manifest.json" rel="manifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />
    ${css}
  </head>

  <body>
    ${script}
  </body>
  </html>`
}
