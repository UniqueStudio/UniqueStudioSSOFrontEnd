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
        158: '39.5rem',
        206: '51.5rem',
      },
      flex: {
        4: '4 1 0%',
      },
      maxHeight: {
        158: '39.5rem',
        179: '44.75rem',
      },
      minHeight: {
        158: '39.5rem',
        193: '48.25rem',
        185.5: '46.375rem',
      },
    },
  },
  plugins: [],
};
