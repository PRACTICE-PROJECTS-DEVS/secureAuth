'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import StepIndicator from '@/components/StepIndicator';
import OtpInput from '@/components/OtpInput';
import { ToastContainer, useToast } from '@/components/Toast';
import { getUserEmail } from '@/lib/auth';
import api from '@/lib/axios';

const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = getUserEmail() || 'your email';
    setEmail(storedEmail);
    // Start cooldown on mount
    startCooldown();
  }, []);

  const startCooldown = () => {
    let remaining = RESEND_COOLDOWN;
    setResendCooldown(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      setResendCooldown(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      addToast('Please enter the complete 6-digit code', 'warning');
      return;
    }

    setLoading(true);
    setHasError(false);

    try {
      // ─── REAL API CALL ──────────────────────────────────────────────────
      const res = await api.post('/auth/verify-otp', {
        userId: getUserId(),
        otp: code,
      });
      // ───────────────────────────────────────────────────────────────────

      addToast('OTP verified successfully!', 'success');

      const requiresBiometric =
        res.data.data?.requiresBiometric ||
        (typeof window !== 'undefined' && localStorage.getItem('requires_biometric') === 'true');

      if (requiresBiometric) {
        setTimeout(() => router.push('/verify-biometric'), 900);
      } else {
        // Low risk — get token directly, skip biometric
        const tokenRes = await api.post('/auth/issue-token', { userId: getUserId() });
        const { token } = tokenRes.data.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        setTimeout(() => router.push('/dashboard'), 900);
      }
    } catch (err: any) {
      setHasError(true);
      setOtp(Array(6).fill(''));
      const msg = err?.response?.data?.message ?? 'Invalid or expired OTP. Please try again.';
      addToast(msg, 'error');

      // If too many attempts, show resend prompt immediately
      if (err?.response?.status === 429) {
        setResendCooldown(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);

    try {
      // ─── REAL API CALL ──────────────────────────────────────────────────
      await api.post('/auth/resend-otp', { userId: getUserId() });
      // ───────────────────────────────────────────────────────────────────
      addToast('A new OTP has been sent to your email', 'success');
      startCooldown();
      setOtp(Array(6).fill(''));
      setHasError(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to resend OTP. Please try again.';
      addToast(msg, 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '•') + c)
    : '••••••@••••.com';

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AuthCard>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-blue-dim)] border border-[color-mix(in_srgb,var(--color-blue-accent)_20%,transparent)] mb-4 relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <span className="text-[8px] font-bold text-[var(--color-bg)]">✓</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient-blue">Email Verification</h1>
          <p className="text-[var(--color-muted)] text-sm font-mono mt-1">One-Time Password sent to</p>
          <p className="text-[var(--color-text)] text-sm font-mono font-semibold mt-0.5">{maskedEmail}</p>
        </div>

        <StepIndicator currentStep={2} />

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* OTP Input */}
          <div className="animate-fade-up delay-100">
            <label className="block text-xs font-mono font-medium text-[var(--color-muted)] uppercase tracking-widest mb-4 text-center">
              Enter 6-Digit Code
            </label>
            <OtpInput value={otp} onChange={setOtp} hasError={hasError} />
            {hasError && (
              <p className="mt-3 text-center text-xs text-danger font-mono animate-fade-in">
                Invalid or expired code. Request a new one below.
              </p>
            )}
          </div>

          {/* Expiry notice */}
          <div className="flex items-center justify-center gap-2 animate-fade-up delay-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-xs text-[var(--color-muted)] font-mono">Code expires in 10 minutes</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="
              w-full py-3.5 rounded-xl font-bold text-sm bg-blue-accent text-[var(--color-bg)]
              shadow-[0_0_25px_rgba(96,165,250,0.2)] hover:shadow-[0_0_35px_rgba(96,165,250,0.35)]
              hover:bg-blue-accent/90 active:scale-[0.98] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              flex items-center justify-center gap-2 animate-fade-up delay-300
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Verifying OTP…
              </>
            ) : (
              <>
                Verify Code
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          {/* Resend */}
          <div className="text-center animate-fade-up delay-400">
            <p className="text-xs text-[var(--color-muted)] font-mono mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendLoading}
              className="text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-1.5 mx-auto
                disabled:text-[var(--color-muted)] text-[var(--color-blue-accent)] hover:text-[var(--color-blue-accent)]/80"
            >
              {resendLoading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Sending…
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4"/>
                  </svg>
                  Resend OTP
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border)] animate-fade-up delay-500">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] font-mono transition-colors mx-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Login
          </button>
        </div>


      </AuthCard>
    </>
  );
}
