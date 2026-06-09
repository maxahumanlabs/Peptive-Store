import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      keyframes: {
        'hero-reveal': {
          '0%': { opacity: '0', transform: 'translateY(110%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'stock-drain': {
          '0%': { width: '100%' },
          '100%': { width: 'var(--stock-end, 45%)' },
        },
      },
      animation: {
        'hero-reveal': 'hero-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 25s linear infinite',
        'stock-drain': 'stock-drain 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
      },
    },
  },
  plugins: [],
};
export default config;
