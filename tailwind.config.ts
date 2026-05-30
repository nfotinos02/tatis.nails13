import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nude & Champagne Brand Palette
        nude: {
          50:  '#FAF7F4',
          100: '#F5EDE3',
          200: '#EDD8C4',
          300: '#E0BFA0',
          400: '#CFA07A',
          500: '#C08A62', // primary nude
          600: '#A87050',
          700: '#8A5840',
          800: '#6B4132',
          900: '#4A2C20',
        },
        champagne: {
          50:  '#FDFAF5',
          100: '#FAF3E0',
          200: '#F5E6C2',
          300: '#EDD49A',
          400: '#E0BC6E',
          500: '#D4A44A', // primary champagne/gold
          600: '#B8892E',
          700: '#956E20',
          800: '#715416',
          900: '#4E3A0E',
        },
        cream: {
          DEFAULT: '#FAF6F1',
          dark: '#F2EAE0',
        },
        blush: '#F8EDE6',
        mink: '#2C1810',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-nude': 'linear-gradient(135deg, #FAF6F1 0%, #F5EDE3 50%, #EDD8C4 100%)',
        'gradient-champagne': 'linear-gradient(135deg, #FAF3E0 0%, #F5E6C2 50%, #EDD49A 100%)',
        'gradient-brand': 'linear-gradient(135deg, #C08A62 0%, #D4A44A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
