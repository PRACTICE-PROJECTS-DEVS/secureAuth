/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        bg:       'var(--color-bg)',
        surface:  'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border:   'var(--color-border)',
        'text-primary': 'var(--color-text)',
        muted:    'var(--color-muted)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          dim:     'var(--color-accent-dim)',
        },
        'blue-accent': 'var(--color-blue-accent)',
        'blue-dim':    'var(--color-blue-dim)',
        'pink-accent': 'var(--color-pink-accent)',
        danger:  '#f87171',
        warning: '#fbbf24',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        'scan':       'scan 2s ease-in-out infinite',
        'glow':       'glow 3s ease-in-out infinite alternate',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'theme-in':   'themeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseRing: { '0%, 100%': { transform: 'scale(1)', opacity: '0.6' }, '50%': { transform: 'scale(1.15)', opacity: '0.2' } },
        scan:      { '0%': { top: '10%' }, '50%': { top: '80%' }, '100%': { top: '10%' } },
        glow:      { from: { opacity: '0.08' }, to: { opacity: '0.18' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:   { from: { backgroundPosition: '-200% center' }, to: { backgroundPosition: '200% center' } },
        themeIn:   { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
