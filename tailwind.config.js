import typography from '@tailwindcss/typography'
import utopia from 'tailwind-utopia'
/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [typography(), utopia()],
}
