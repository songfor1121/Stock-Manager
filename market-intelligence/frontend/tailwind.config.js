/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07111F',
        mainText: '#F2EDE3',
        accent: '#C9A96E',
        secondary: '#66758A',
      }
    },
  },
  plugins: [],
}
