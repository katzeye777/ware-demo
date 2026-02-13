import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3f2',
          100: '#fde4e1',
          200: '#fbcec8',
          300: '#f7aba1',
          400: '#f17b6a',
          500: '#e4533d',
          600: '#d13721',
          700: '#b02b18',
          800: '#922818',
          900: '#79271a',
        },
        clay: {
          50: '#f6f5f4',
          100: '#e7e5e3',
          200: '#d1ccc7',
          300: '#b3aba3',
          400: '#978d82',
          500: '#857a6e',
          600: '#6f6659',
          700: '#5b5349',
          800: '#4d463e',
          900: '#433d37',
        },
      },
    },
  },
  plugins: [],
}
export default config
