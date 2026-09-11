/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        warm: '#FFE8D6',
        peach: '#FFD9C0',
        accent: '#F4731F',
        terracotta: '#C75B39',
        ink: '#5A4632',
        muted: '#9B8675',
      },
      fontFamily: {
        hand: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 20px rgba(199,91,57,0.12)',
      },
    },
  },
  plugins: [],
}
