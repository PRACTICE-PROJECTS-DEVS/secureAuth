'use client';

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  hasError?: boolean;
}

export default function OtpInput({ value, onChange, hasError = false }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newValue = [...value];
    newValue[index] = val[val.length - 1]; // take last char if multiple pasted
    onChange(newValue);

    // Move to next
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const newValue = [...value];
        newValue[index] = '';
        onChange(newValue);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newValue = [...value];
        newValue[index - 1] = '';
        onChange(newValue);
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newValue = [...value];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newValue[i] = char;
    });
    onChange(newValue);
    // Focus last filled or last box
    const lastIndex = Math.min(pasted.length - 1, 5);
    inputsRef.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`
            w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border
            bg-surface2 outline-none transition-all duration-200
            ${hasError
              ? 'border-danger text-danger shadow-[0_0_12px_rgba(248,113,113,0.2)]'
              : value[i]
              ? 'border-accent text-accent shadow-[0_0_12px_rgba(74,222,128,0.15)]'
              : 'border-border text-white focus:border-accent/70 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'
            }
          `}
        />
      ))}
    </div>
  );
}
