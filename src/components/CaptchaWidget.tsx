'use client';

import { useState } from 'react';

interface CaptchaWidgetProps {
  onVerify: (verified: boolean) => void;
}

export default function CaptchaWidget({ onVerify }: CaptchaWidgetProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (checked) return;
    setLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
      onVerify(true);
    }, 1200);
  };

  return (
    <div className="border border-border rounded-xl bg-surface2 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={handleCheck}
          className={`
            w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300
            ${checked
              ? 'bg-accent border-accent shadow-[0_0_12px_rgba(74,222,128,0.3)]'
              : 'border-border bg-surface hover:border-muted'
            }
          `}
        >
          {loading ? (
            <svg className="animate-spin w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : checked ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#07080d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </button>
        <span className="text-sm text-[#e8eaf6]/80 font-mono">
          {checked ? "Verified – I'm not a robot" : "I'm not a robot"}
        </span>
      </div>

      {/* reCAPTCHA logo placeholder */}
      <div className="flex flex-col items-center gap-0.5 opacity-40">
        <div className="w-8 h-8">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" stroke="#4ade80" strokeWidth="3" fill="none"/>
            <path d="M20 32 C20 25, 28 18, 36 22 C44 26, 46 36, 40 42" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M20 32 L26 26 L20 20" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <span className="text-[9px] font-mono text-muted">reCAPTCHA</span>
        <span className="text-[7px] font-mono text-muted">Privacy · Terms</span>
      </div>
    </div>
  );
}
