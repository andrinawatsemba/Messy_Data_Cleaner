/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tile: {
          bg: '#eef3f0',
          line: '#d8e3dc',
        },
        spruce: {
          DEFAULT: '#2e7d58',
          hover: '#246546',
          light: '#e2ede6',
        },
        spray: {
          DEFAULT: '#3b82a6',
          light: '#e0f2fe',
        },
        sponge: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        caddy: {
          DEFAULT: '#d9466f',
          light: '#fce7f3',
        },
        ink: '#1a2923',
        muted: '#596f64',
        cardborder: '#d4e0d9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
