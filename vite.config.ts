import tailwindcssConfig from './tailwind.config'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import postcssImport from 'postcss-import'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'
import { defineConfig } from 'vite'

const production = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    alias: { components: resolve('src/components'), data: resolve('src/data'), helpers: resolve('src/helpers') },
  },
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
      plugins: [tailwindcssNesting(), postcssImport(), tailwindcss(tailwindcssConfig), autoprefixer],
    },
  },
  optimizeDeps: {
    exclude: ['@roxy/routify'],
  },
})
