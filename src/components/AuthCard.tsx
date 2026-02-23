'use client';

import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  width?: string;
}

export default function AuthCard({ children, width = 'max-w-md' }: AuthCardProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-glow"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
            top: '-200px', right: '-200px',
          }}
        />
        <div
          className="absolute rounded-full animate-glow"
          style={{
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)',
            bottom: '-150px', left: '-150px',
            animationDelay: '1.5s',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Card */}
      <div className={`relative w-full ${width} z-10`}>
        {/* Top glow line */}
        <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

        <div className="glass border border-border rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          {children}
        </div>

        {/* Bottom reflection */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-20"
          style={{ background: 'rgba(74,222,128,0.3)' }}
        />
      </div>
    </div>
  );
}
