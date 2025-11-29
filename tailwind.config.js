/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0EA5E9',
          dark: '#0369A1',
        },
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(14, 165, 233, 0.35)',
      },
    },
  },
  plugins: [],
}



