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
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
      onVerify(true);
    }, 1200);
  };

  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between transition-colors duration-300"
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface2)' }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          className="w-6 h-6 rounded flex items-center justify-center transition-all duration-300 flex-shrink-0"
          style={{
            background: checked ? 'var(--color-accent)' : 'transparent',
            border: checked ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
            boxShadow: checked ? '0 0 12px color-mix(in srgb, var(--color-accent) 30%, transparent)' : 'none',
          }}
        >
          {loading ? (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-accent)' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : checked ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </button>
        <span className="text-sm font-mono" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
          {checked ? "Verified – I'm not a robot" : "I'm not a robot"}
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5 opacity-40">
        <div className="w-8 h-8">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="28" stroke="var(--color-accent)" strokeWidth="3" fill="none"/>
            <path d="M20 32 C20 25, 28 18, 36 22 C44 26, 46 36, 40 42" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M20 32 L26 26 L20 20" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <span className="text-[9px] font-mono" style={{ color: 'var(--color-muted)' }}>reCAPTCHA</span>
        <span className="text-[7px] font-mono" style={{ color: 'var(--color-muted)' }}>Privacy · Terms</span>
      </div>
    </div>
  );
}
