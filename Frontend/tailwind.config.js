/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        forest: {
          DEFAULT: '#1a3a1a',
          light:   '#2d5a2d',
          deep:    '#0d2010',
        },
        saffron: {
          DEFAULT: '#e67e22',
          light:   '#f39c12',
          dark:    '#d35400',
          50:      '#fff8ed',
          100:     '#fdeece',
          200:     '#fbda9a',
          300:     '#f8be63',
          400:     '#f4982c',
          500:     '#e67e22',
          600:     '#d35400',
        },
        cream: '#fdfbf7',
        gold:  '#c8a951',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-up':   'fadeInUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-right':  'slideRight 0.6s ease forwards',
        'pulse-slow':   'pulse 3s infinite',
        'bounce-slow':  'bounce 2s infinite',
        'float':        'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'card':  '0 2px 20px rgba(0,0,0,0.08)',
        'hover': '0 8px 40px rgba(0,0,0,0.15)',
        'green': '0 4px 20px rgba(21,128,61,0.3)',
      },
    },
  },
  plugins: [],
};
