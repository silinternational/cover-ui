import { resolve } from 'path'
import postCssNesting from 'postcss-nesting'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

const production = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { 'components': resolve('src/components'), 'data': resolve('src/data'), 'helpers': resolve('src/helpers') } },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __EVIRONMENT__: JSON.stringify(process.env.NODE_ENV),
  },
  css: {
    postcss: {
      plugins: [
        postCssNesting(),
        // require('postcss-import'),
        // require('@tailwindcss/nesting'),
        // require('tailwindcss'),
        // require('autoprefixer')
      ]
    }
  },
})
