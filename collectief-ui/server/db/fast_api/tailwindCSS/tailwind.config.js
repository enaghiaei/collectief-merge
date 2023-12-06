/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../templates/**/*.html"],
  theme: {
    screens: {
      sm: '480',
      md:'768',
      lg:'976',
      xl:'1440'
    },
    extend: {
      colors: {
        brightYellow: 'hsl(12, 88%, 59%)'
      }
    },
  },
  plugins: [],
}
