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
      // Simulate ~90% success rate
      const success = Math.random() > 0.1;
      setState(success ? 'success' : 'failure');
      onResult(success);
    }, 2800);
  };

  const handleRetry = () => {
    setState('idle');
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Fingerprint visual */}
      <div className="relative">
        {/* Outer pulse rings */}
        {state === 'scanning' && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-[-8px] rounded-full border border-accent/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
          </>
        )}

        <div
          className={`
            relative w-32 h-32 rounded-full border-2 flex items-center justify-center cursor-pointer
            transition-all duration-500 select-none
            ${state === 'idle' ? 'border-border bg-surface2 hover:border-accent/50 hover:bg-surface hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]'
              : state === 'scanning' ? 'border-accent bg-accent/5 shadow-[0_0_40px_rgba(74,222,128,0.2)]'
              : state === 'success' ? 'border-accent bg-accent/10 shadow-[0_0_50px_rgba(74,222,128,0.3)]'
              : 'border-danger bg-danger/10 shadow-[0_0_30px_rgba(248,113,113,0.2)]'
            }
          `}
          onClick={state === 'idle' ? handleScan : undefined}
        >
          {/* Scan line */}
          {state === 'scanning' && (
            <div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan"
              style={{ boxShadow: '0 0 8px rgba(74,222,128,0.6)' }}
            />
          )}

          {/* Icon */}
          {state === 'idle' || state === 'scanning' ? (
            <svg
              viewBox="0 0 80 80"
              className={`w-16 h-16 transition-all duration-300 ${state === 'scanning' ? 'text-accent opacity-80' : 'text-muted'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {/* Fingerprint lines */}
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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-1">
        {state === 'idle' && (
          <>
            <p className="text-[#e8eaf6] font-semibold">Touch to Scan</p>
            <p className="text-muted text-sm font-mono">Place your finger on the sensor</p>
          </>
        )}
        {state === 'scanning' && (
          <>
            <p className="text-accent font-semibold">Scanning…</p>
            <p className="text-muted text-sm font-mono">Hold still while we verify</p>
          </>
        )}
        {state === 'success' && (
          <>
            <p className="text-accent font-semibold">Biometric Verified</p>
            <p className="text-muted text-sm font-mono">Identity confirmed successfully</p>
          </>
        )}
        {state === 'failure' && (
          <>
            <p className="text-danger font-semibold">Verification Failed</p>
            <p className="text-muted text-sm font-mono">Could not match biometric data</p>
          </>
        )}
      </div>

      {/* Action buttons */}
      {state === 'idle' && (
        <button
          onClick={handleScan}
          className="px-8 py-3 bg-accent text-bg font-bold text-sm rounded-xl hover:bg-accent/90 transition-all duration-200 shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)] active:scale-95"
        >
          Begin Scan
        </button>
      )}

      {state === 'failure' && (
        <button
          onClick={handleRetry}
          className="px-8 py-3 border border-danger/50 text-danger font-bold text-sm rounded-xl hover:bg-danger/10 transition-all duration-200 active:scale-95"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
