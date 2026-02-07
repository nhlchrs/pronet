/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // App theme colors
        primary: {
          dark: '#0B1929',
          card: '#1A2A3A',
          border: '#2A4A5A',
          input: '#0f0f0f',
          accent: '#4CD3C8',
          accentLight: '#5DDDD2',
          text: '#DAFAF4',
        }
      },
      fontFamily: {
        'red-hat': ['Red Hat Text', 'Red Hat Content', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
