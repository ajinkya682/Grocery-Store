/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B3D2E',     // Deep Green
        secondary: '#8B5E34',   // Warm Brown
        accent: '#F59E0B',      // Orange
        dark: '#1F2937',        // Text
        light: '#F9F7F3',       // Background
        
        // Keeping legacy ones just in case to prevent breaking other pages, though UI will transition to new ones.
        forest: { DEFAULT: '#0B3D2E', light: '#145c46', deep: '#06261d' },
        saffron: { DEFAULT: '#F59E0B', light: '#fcd34d', dark: '#d97706', 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        cream: '#F9F7F3',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)',
        card: '0 15px 35px rgba(0,0,0,0.12)',
        green: '0 4px 20px rgba(11, 61, 46, 0.3)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
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
    },
  },
  plugins: [],
};
