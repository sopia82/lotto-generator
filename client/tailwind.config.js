/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotto: {
          yellow: '#FBC400',
          blue: '#69C8F2',
          red: '#FF7272',
          gray: '#AAAAAA',
          green: '#B0D840',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ball: 'inset -4px -4px 6px rgba(0,0,0,0.3), 3px 3px 6px rgba(0,0,0,0.25)',
        glow: '0 0 15px rgba(251, 196, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
