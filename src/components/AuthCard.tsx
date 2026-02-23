'use client';

import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface AuthCardProps {
  children: ReactNode;
  width?: string;
}

export default function AuthCard({ children, width = 'max-w-md' }: AuthCardProps) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-glow"
          style={{
            width: '600px', height: '600px',
            background: `radial-gradient(circle, var(--orb1) 0%, transparent 70%)`,
            top: '-200px', right: '-200px',
          }}
        />
        <div
          className="absolute rounded-full animate-glow"
          style={{
            width: '500px', height: '500px',
            background: `radial-gradient(circle, var(--orb2) 0%, transparent 70%)`,
            bottom: '-150px', left: '-150px',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '300px', height: '300px',
            background: `radial-gradient(circle, var(--orb3) 0%, transparent 70%)`,
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(var(--color-muted) 1px, transparent 1px),
                              linear-gradient(90deg, var(--color-muted) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Theme toggle — fixed top-right corner */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className={`relative w-full ${width} z-10`}>
        {/* Top glow line */}
        <div
          className="absolute -top-px left-1/4 right-1/4 h-px opacity-60"
          style={{ background: `linear-gradient(to right, transparent, var(--color-accent), transparent)` }}
        />

        <div
          className="glass rounded-2xl p-8 card-shadow transition-all duration-300"
          style={{ border: '1px solid var(--color-border)' }}
        >
          {children}
        </div>

        {/* Bottom glow reflection */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-15"
          style={{ background: 'var(--color-accent)' }}
        />
      </div>
    </div>
  );
}
