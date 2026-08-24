/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#1f2937', // gray-800
        accent: '#3b82f6',     // blue-500
        primary: '#2563eb',    // blue-600
        border: '#e5e7eb',     // gray-200
      },
    },
  },
  plugins: [],
}
