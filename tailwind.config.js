/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-utopia')],
}
