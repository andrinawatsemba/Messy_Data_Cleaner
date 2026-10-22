/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#fdfbf7',
          light: '#fcf8ee',
          card: '#fffdfa',
        },
        warmborder: {
          DEFAULT: '#ded2bd',
          subtle: '#ebdfcb',
          strong: '#cbbda4',
        },
        spruce: {
          DEFAULT: '#2c5842',
          hover: '#224634',
          light: '#e5eee8',
        },
        wood: {
          DEFAULT: '#8b5e3c',
          light: '#f5eee6',
          dark: '#633e22',
        },
        spray: {
          DEFAULT: '#347596',
          light: '#e1eff5',
        },
        sponge: {
          DEFAULT: '#cf7b19',
          light: '#fbf0e0',
        },
        caddy: {
          DEFAULT: '#c24b64',
          light: '#fcedf0',
        },
        ink: '#23221e',
        muted: '#69645a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
