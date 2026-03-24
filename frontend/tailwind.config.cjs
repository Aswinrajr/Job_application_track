/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-dark': '#0d0d0d',
        'app-card': '#161616',
        'app-border': '#262626',
        'app-muted': '#888888',
        accent: {
          DEFAULT: '#6366f1', // Indigo
          hover: '#4f46e5',
        },
        status: {
          applied: '#3b82f6', // Blue
          interview: '#eab308', // Yellow
          offer: '#22c55e', // Green
          rejected: '#ef4444', // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}