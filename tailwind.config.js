/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#ED492F',
          dark:   '#1E1E24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 80px -20px rgba(237, 73, 47, 0.55)',
        panel: '0 24px 80px -24px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
