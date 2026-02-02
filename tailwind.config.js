/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          coral: '#fe5756',
          'coral-light': '#ff7a79',
          'coral-dark': '#e54d4c',
          charcoal: '#545454',
          'charcoal-light': '#6b6b6b',
          'charcoal-dark': '#3d3d3d',
        },
      },
    },
  },
  plugins: [],
}
