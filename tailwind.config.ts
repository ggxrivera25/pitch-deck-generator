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
        brand: {
          50:  '#ecf4fe',  // light blue bg
          100: '#f1f3f8',  // light gray bg
          200: '#b0b6bb',  // border gray
          300: '#869ab1',  // muted text
          400: '#3075a6',  // mid blue
          500: '#1f4a6a',  // dark mid blue
          600: '#002d62',  // primary navy
          700: '#08193c',  // darker navy
          800: '#000e2f',  // darkest navy
          900: '#000000',  // black
        },
        accent: {
          DEFAULT: '#d11242',
          light:   '#f5463b',
        },
        ui: {
          border:     '#dddddd',
          borderDark: '#cccccc',
          borderBlue: '#0078c1',
          muted:      '#aaaaaa',
          subtle:     '#949494',
          link:       '#3075a6',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
