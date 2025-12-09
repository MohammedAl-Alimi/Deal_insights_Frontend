/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14B8A6', // Teal from design
          dark: '#0D9488',
          light: '#5EEAD4'
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      }
    },
  },
  plugins: [],
}
