import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blnc: {
          canvas: '#F4F4F2',
          surface: '#E8E8E8',
          accent: '#BBBFCA',
          ink: '#495464',
          'ink-strong': '#2E343F',
        },
        neutral: {
          50: '#F4F4F2',
          100: '#E8E8E8',
          200: '#D4D6DC',
          300: '#BBBFCA',
          400: '#949BAA',
          500: '#727B8C',
          600: '#5E6776',
          700: '#495464',
          800: '#3A424F',
          900: '#2E343F',
          950: '#232830',
        },
      },
      fontFamily: {
        sans: ['Host Grotesk Variable', 'Host Grotesk', 'sans-serif'],
        description: ['Manrope Variable', 'Manrope', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
