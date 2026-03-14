/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{tsx,ts,jsx,js}",
    "./src/**/*.{tsx,ts,jsx,js}",
    "./services/**/*.{tsx,ts,jsx,js}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e40af', // Deep blue
          red: '#dc2626',  // Vivid red
          purple: '#7e22ce', // For contrast/blending
        }
      }
    },
  },
  plugins: [],
}
