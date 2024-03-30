/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        193: '48.25rem',
        66: '16.5rem',
      },
      height: {
        183: '45.75rem',
        193: '48.25rem',
      },
      flex: {
        4: '4 1 0%',
      },
      maxHeight: {
        193: '48.25rem',
        200: '50rem',
        216: '54rem',
      },
    },
  },
  plugins: [],
};
