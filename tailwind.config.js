/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)'],
        mono: ['var(--font-dm-mono)'],
      },
      colors: {
        bg: '#07080d',
        surface: '#0f1018',
        surface2: '#171824',
        border: '#1e2030',
        accent: {
          DEFAULT: '#4ade80',
          dim: 'rgba(74,222,128,0.15)',
        },
        blue: {
          accent: '#60a5fa',
          dim: 'rgba(96,165,250,0.12)',
        },
        pink: {
          accent: '#f472b6',
          dim: 'rgba(244,114,182,0.12)',
        },
        muted: '#4a4d6a',
        danger: '#f87171',
        warning: '#fbbf24',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.15)', opacity: '0.2' },
        },
        scan: {
          '0%': { top: '10%' },
          '50%': { top: '80%' },
          '100%': { top: '10%' },
        },
        glow: {
          from: { opacity: '0.08' },
          to: { opacity: '0.18' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to: { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
};
