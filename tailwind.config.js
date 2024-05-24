/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
      width: {
        '2vw': '2vw',
      },
      padding: {
        '0.3vw': '0.3vw',
      },
    },
    minWidth: {
      400: '400px',
      500: '500px',
    },
  },
  plugins: [],
};
