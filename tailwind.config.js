/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      colors: {
        veloura: {
          ink: '#201627',
          muted: '#776D80',
          line: '#EEE7F0',
          blush: '#FFE9F0',
          rose: '#F64F83',
          berry: '#D93D72',
          lilac: '#8F74D7',
          mint: '#CFE9DD'
        }
      },
      boxShadow: {
        soft: '0 18px 55px rgba(80, 49, 86, 0.10)',
        card: '0 14px 35px rgba(80, 49, 86, 0.08)'
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
