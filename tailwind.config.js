/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        234.5: '58.65rem',
        174: '43.5rem',
      },
      flex: {
        4: '4 1 0%',
      },
      maxHeight: {
        158: '39.5rem',
      },
    },
  },
  plugins: [],
};
