/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./css/**/*.css"
  ],
  darkMode: 'class',
  theme: {
      extend: {
          fontFamily: {
              sans: ['Helvetica', 'Arial', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
              dark: {
                  900: '#050508',
                  800: '#0a0a0f',
                  700: '#13131f',
                  600: '#1c1c2e',
                  500: '#252540',
              },
              cyber: {
                  cyan: '#00f0ff',
                  green: '#00ff9d',
                  purple: '#b829dd',
                  magenta: '#ff006e',
                  amber: '#ffb800',
                  blue: '#0066ff',
              }
          },
          animation: {
              'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'glow': 'glow 2s ease-in-out infinite alternate',
              'float': 'float 6s ease-in-out infinite',
              'scan': 'scan 8s linear infinite',
              'flicker': 'flicker 3s linear infinite',
              'glitch': 'glitch 1s linear infinite',
          },
          keyframes: {
              glow: {
                  '0%': { boxShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 15px #00f0ff' },
                  '100%': { boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff, 0 0 40px #00f0ff' },
              },
              float: {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-20px)' },
              },
              scan: {
                  '0%': { transform: 'translateY(-100%)' },
                  '100%': { transform: 'translateY(100%)' },
              },
              flicker: {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.8 },
                  '52%': { opacity: 0.2 },
                  '54%': { opacity: 0.8 },
              },
              glitch: {
                  '0%, 100%': { transform: 'translate(0)' },
                  '20%': { transform: 'translate(-2px, 2px)' },
                  '40%': { transform: 'translate(-2px, -2px)' },
                  '60%': { transform: 'translate(2px, 2px)' },
                  '80%': { transform: 'translate(2px, -2px)' },
              }
          }
      }
  },
  plugins: [],
}
