/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        '0.8vw': '0.8vw',
        '1vw': '1vw',
        '1.2vw': '1.2vw',
        '2vw': '2vw',
        '2.5vw': '2.5vw',
        '5vw': '5vw',
      },
      margin: {
        '1/8': '12.5%',
      },
      height: {
        '2vw': '2vw',
        '2.5vw': '2.5vw',
        '183': '45.75rem',
        '193': '48.25rem',
        '158': '39.5rem',
        '206': '51.5rem',
        '234.5': '58.65rem',
        '174': '43.5rem',
      },
      width: {
        '2vw': '2vw',
        '193': '48.25rem',
        '66': '16.5rem',
      },
      padding: {
        '0.3vw': '0.3vw',
      },
      flex: {
        4: '4 1 0%',
      },
      maxHeight: {
        158: '39.5rem',
        179: '44.75rem',
      },
      minWidth: {
        400: '400px',
        500: '500px',
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