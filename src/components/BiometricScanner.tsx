'use client';

import { useState } from 'react';

type ScanState = 'idle' | 'scanning' | 'success' | 'failure';

interface BiometricScannerProps {
  onResult: (success: boolean) => void;
}

export default function BiometricScanner({ onResult }: BiometricScannerProps) {
  const [state, setState] = useState<ScanState>('idle');

  const handleScan = () => {
    if (state === 'scanning') return;
    setState('scanning');
    setTimeout(() => {
      const success = Math.random() > 0.1;
      setState(success ? 'success' : 'failure');
      onResult(success);
    }, 2800);
  };

  const handleRetry = () => setState('idle');

  const borderColor =
    state === 'scanning' ? 'var(--color-accent)' :
    state === 'success'  ? 'var(--color-accent)' :
    state === 'failure'  ? '#f87171' :
    'var(--color-border)';

  const bgColor =
    state === 'scanning' ? 'color-mix(in srgb, var(--color-accent) 5%, transparent)' :
    state === 'success'  ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' :
    state === 'failure'  ? 'rgba(248,113,113,0.10)' :
    'var(--color-surface2)';

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative">
        {state === 'scanning' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 animate-ping opacity-30" style={{ borderColor: 'var(--color-accent)', animationDuration: '1.5s' }} />
            <div className="absolute inset-[-8px] rounded-full border animate-ping opacity-20" style={{ borderColor: 'var(--color-accent)', animationDuration: '2s', animationDelay: '0.3s' }} />
          </>
        )}

        <div
          className="relative w-32 h-32 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-500 select-none"
          style={{
            borderColor,
            background: bgColor,
            boxShadow: state !== 'idle'
              ? `0 0 40px color-mix(in srgb, ${borderColor} 20%, transparent)`
              : 'none',
          }}
          onClick={state === 'idle' ? handleScan : undefined}
        >
          {state === 'scanning' && (
            <div
              className="absolute left-4 right-4 h-0.5 animate-scan"
              style={{
                background: `linear-gradient(to right, transparent, var(--color-accent), transparent)`,
                boxShadow: '0 0 8px var(--color-accent)',
              }}
            />
          )}

          {(state === 'idle' || state === 'scanning') ? (
            <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" stroke={state === 'scanning' ? 'var(--color-accent)' : 'var(--color-muted)'} strokeWidth="1.5" strokeLinecap="round" style={{ transition: 'stroke 0.3s', opacity: state === 'scanning' ? 0.8 : 1 }}>
              <path d="M40 18 C30 18, 22 26, 22 36 C22 42, 24 47, 28 51" opacity="0.5"/>
              <path d="M40 22 C32 22, 26 28, 26 36 C26 41, 28 45, 31 49"/>
              <path d="M40 26 C34 26, 30 30, 30 36 C30 40, 32 44, 35 47"/>
              <path d="M40 30 C36 30, 34 33, 34 36 C34 38, 35 41, 37 43"/>
              <path d="M40 34 C38 34, 37 35, 37 36 C37 37, 38 39, 39 40"/>
              <path d="M40 22 C48 22, 54 28, 54 36 C54 41, 52 45, 49 49"/>
              <path d="M40 26 C46 26, 50 30, 50 36 C50 40, 48 44, 45 47"/>
              <path d="M40 30 C44 30, 46 33, 46 36 C46 38, 45 41, 43 43"/>
              <path d="M40 18 C50 18, 58 26, 58 36 C58 42, 56 47, 52 51"/>
              <line x1="28" y1="54" x2="32" y2="60"/>
              <line x1="35" y1="58" x2="37" y2="64"/>
              <line x1="43" y1="58" x2="45" y2="64"/>
              <line x1="49" y1="54" x2="53" y2="60"/>
            </svg>
          ) : state === 'success' ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          )}
        </div>
      </div>

      <div className="text-center space-y-1">
        {state === 'idle' && (
          <>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Touch to Scan</p>
            <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>Place your finger on the sensor</p>
          </>
        )}
        {state === 'scanning' && (
          <>
            <p className="font-semibold" style={{ color: 'var(--color-accent)' }}>Scanning…</p>
            <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>Hold still while we verify</p>
          </>
        )}
        {state === 'success' && (
          <>
            <p className="font-semibold" style={{ color: 'var(--color-accent)' }}>Biometric Verified</p>
            <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>Identity confirmed successfully</p>
          </>
        )}
        {state === 'failure' && (
          <>
            <p className="font-semibold text-danger">Verification Failed</p>
            <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>Could not match biometric data</p>
          </>
        )}
      </div>

      {state === 'idle' && (
        <button
          onClick={handleScan}
          className="px-8 py-3 font-bold text-sm rounded-xl active:scale-95 transition-all duration-200"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            boxShadow: '0 0 20px color-mix(in srgb, var(--color-accent) 25%, transparent)',
          }}
        >
          Begin Scan
        </button>
      )}
      {state === 'failure' && (
        <button
          onClick={handleRetry}
          className="px-8 py-3 font-bold text-sm rounded-xl active:scale-95 transition-all duration-200 text-danger"
          style={{ border: '1px solid rgba(248,113,113,0.4)' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
