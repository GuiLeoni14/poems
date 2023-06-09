/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Libre Baskerville', 'Inter', 'sans-serif'],
        inter: ['Inter', 'Libre Baskerville', 'sans-serif'],
      },
      colors: {
        gray: {
          100: '#E1E1E6',
          200: '#C4C4CC',
          300: '#8D8D99',
          500: '#323238',
          600: '#29292E',
          700: '#121214',
          900: '#09090A',
        },
      },
      container: {
        padding: '1rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
