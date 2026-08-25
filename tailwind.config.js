/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Anton', '"Archivo Black"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        paper: '#F7F4EB',
        ink: '#171310',
        card: '#FBF9F2',
        'card-white': '#FFFFFF',
        'stage-bg': '#100D0A',
        'stage-text': '#F7F4EB',
        background: 'var(--bg-app)',
        foreground: 'var(--fg-primary)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        mustard: 'var(--secondary)',
        border: 'var(--border-ink)',
      },
      borderRadius: {
        'card': '0.375rem', // 6px
      }
    },
  },
  plugins: [],
}
