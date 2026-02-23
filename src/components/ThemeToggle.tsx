'use client';

import { useTheme } from './ThemeProvider';
import { useState } from 'react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    toggleTheme();
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center
        border transition-all duration-300 group overflow-hidden
        ${isDark
          ? 'border-border bg-surface2 hover:border-accent/40 hover:bg-accent/5 hover:shadow-[0_0_16px_rgba(74,222,128,0.15)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface2)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] hover:shadow-[0_0_16px_rgba(22,163,74,0.15)]'
        }
        ${className}
      `}
    >
      {/* Moon icon (shown in dark mode → clicking goes to light) */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark
            ? spinning ? 'rotate(30deg) scale(0.7)' : 'rotate(0deg) scale(1)'
            : 'rotate(-60deg) scale(0.4)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>

      {/* Sun icon (shown in light mode → clicking goes to dark) */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark
            ? 'rotate(60deg) scale(0.4)'
            : spinning ? 'rotate(-30deg) scale(0.7)' : 'rotate(0deg) scale(1)',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1"  x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1"  y1="12" x2="3"  y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
        </svg>
      </span>

      {/* Ripple on click */}
      {spinning && (
        <span
          className="absolute inset-0 rounded-xl animate-ping opacity-20"
          style={{ background: 'var(--color-accent)' }}
        />
      )}
    </button>
  );
}
