/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          marvel: {
            primary: '#ED1D24', // Marvel's iconic red
            secondary: '#333333',
            background: '#F0F0F0',
          }
        },
        fontFamily: {
          sans: ['Roboto', 'system-ui', 'sans-serif'],
          marvel: ['Marvel', 'sans-serif']
        },
        boxShadow: {
          'marvel-card': '0 4px 6px rgba(0, 0, 0, 0.1)',
          'marvel-hover': '0 6px 12px rgba(0, 0, 0, 0.15)'
        },
        animation: {
          'fade-in': 'fadeIn 0.3s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          }
        }
      },
    },
    plugins: [],
  }