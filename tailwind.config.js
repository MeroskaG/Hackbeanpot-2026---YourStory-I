/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        // Your existing blue colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Teammate's green colors for landing page
        forest: {
          50: '#f0f4f1',
          100: '#d9e4dc',
          200: '#b6cdb9',
          300: '#8db290',
          400: '#6b8e6f',
          500: '#5a7d5e',
          600: '#4a644c',
          700: '#3c4f3e',
          800: '#324035',
          900: '#2b362d',
        }
      }
    },
  },
  plugins: [],
}