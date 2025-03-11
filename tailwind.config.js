/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#6B7280',
          50: '#F8F9FA',
          100: '#F1F2F4',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        'dark': {
          DEFAULT: '#1A1A1A',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      backgroundColor: {
        'app': '#262626', // solid grey background
        'header': '#171717', // darker header
        'card': '#1F1F1F', // slightly lighter than background for cards
      },
      boxShadow: {
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'inner-md': 'inset 0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'inner-lg': 'inset 0 8px 10px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} 