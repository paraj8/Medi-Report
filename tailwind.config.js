/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e2',
          300: '#aab3c4',
          400: '#7a8499',
          500: '#56627a',
          600: '#3e485e',
          700: '#2b3346',
          800: '#1d2535',
          900: '#121826',
          950: '#0a0e18',
        },
        gold: {
          50: '#fbf7ee',
          100: '#f5ecd4',
          200: '#ead7a8',
          300: '#ddbb78',
          400: '#cfa04f',
          500: '#bd8537',
          600: '#a36a2c',
          700: '#835127',
          800: '#6b4325',
          900: '#5a3923',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,24,38,0.04), 0 8px 24px -12px rgba(18,24,38,0.12)',
        'card-lg': '0 2px 4px rgba(18,24,38,0.05), 0 24px 48px -20px rgba(18,24,38,0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', maxHeight: '0', marginTop: '0' },
          '100%': { opacity: '1', maxHeight: '120px', marginTop: '0.75rem' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-down': 'slide-down 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
