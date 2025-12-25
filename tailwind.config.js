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
          dark: '#121212',
          card: '#1a1a1a',
          border: '#313131',
          input: '#0f0f0f',
          accent: '#11E44F',
          accentLight: '#8AFFAC',
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
