/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tdg: {
          brown: '#2B2118',
          'brown-light': '#3D3023',
          'brown-dark': '#1C150F',
          cream: '#F7F3EA',
          'cream-dark': '#EDE6D8',
          green: '#536B4F',
          'green-light': '#6B8766',
          'green-dark': '#3E513A',
          orange: '#E86A2C',
          'orange-light': '#F07E44',
          'orange-dark': '#C9551C',
          sage: '#DCE5D5',
          'sage-dark': '#C6D3BD',
          yellow: '#F3B63F',
          card: '#FFFDF8',
          beige: '#F0EAE1',
          surface: '#FDFBF7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(43, 33, 24, 0.05), 0 1px 4px -1px rgba(43, 33, 24, 0.03)',
        'card': '0 4px 20px -2px rgba(43, 33, 24, 0.06), 0 2px 6px -1px rgba(43, 33, 24, 0.03)',
        'float': '0 12px 32px -4px rgba(43, 33, 24, 0.1), 0 4px 12px -2px rgba(43, 33, 24, 0.05)',
        'glow-orange': '0 0 20px rgba(232, 106, 44, 0.15), 0 0 40px rgba(232, 106, 44, 0.05)',
        'glow-green': '0 0 20px rgba(83, 107, 79, 0.15), 0 0 40px rgba(83, 107, 79, 0.05)',
        'glass': '0 8px 32px rgba(43, 33, 24, 0.08)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
