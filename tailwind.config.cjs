/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'start': ['PressStart2p'],
      'share': ['ShareTech'],
    },
    extend: {
      colors: {
        dirt: '#1d1d1d'
      }
    },
  },
  plugins: [],
}
