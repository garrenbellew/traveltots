/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Warm vacation blue - like sunny skies and clear waters
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae8fd',
          300: '#7dd4fc',
          400: '#3fb8f7',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        vacation: {
          // Warm sunset orange for accents
          orange: '#ff6b35',
          orangeLight: '#ff8c61',
          orangeDark: '#e55a2b',
          // Soft beach sand
          sand: '#f5e6d3',
          sandLight: '#faf5ef',
          sandDark: '#d4c4b0',
          // Ocean blue
          ocean: '#2a8fd8',
          oceanLight: '#5ab0e8',
          oceanDark: '#1e6ba8',
          // Warm coral
          coral: '#ff6b6b',
          // Tropical green
          tropical: '#26a69a',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'vacation': '0 4px 20px -2px rgba(255, 107, 53, 0.2)',
      },
    },
  },
  plugins: [],
}

