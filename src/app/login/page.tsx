'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';
import StepIndicator from '@/components/StepIndicator';
import CaptchaWidget from '@/components/CaptchaWidget';
import { ToastContainer, useToast } from '@/components/Toast';
import { setUserId, setUserEmail } from '@/lib/auth';
import api from '@/lib/axios';

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

export default function LoginPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const startLockout = () => {
    setLockedOut(true);
    let remaining = LOCKOUT_SECONDS;
    setLockoutTimer(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      setLockoutTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setLockedOut(false);
        setFailedAttempts(0);
        setShowCaptcha(false);
        setCaptchaVerified(false);
      }
    }, 1000);
  };

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (lockedOut) return;
    if (showCaptcha && !captchaVerified) {
      addToast('Please complete the CAPTCHA verification', 'warning');
      return;
    }

    setLoading(true);
    try {
      // ─── REAL API CALL ──────────────────────────────────────────────────
      const res = await api.post('/auth/login', { email, password });
      // ───────────────────────────────────────────────────────────────────

      const { userId, requiresBiometric } = res.data.data;
      setUserId(userId);
      setUserEmail(email);

      // Store whether biometric is required so verify-otp page can redirect correctly
      if (typeof window !== 'undefined') {
        localStorage.setItem('requires_biometric', requiresBiometric ? 'true' : 'false');
      }

      addToast('Password verified! OTP sent to your email…', 'success');
      setTimeout(() => router.push('/verify-otp'), 900);
    } catch (err: any) {
      const data = err?.response?.data;
      const status = err?.response?.status;

      if (status === 423) {
        // Account locked by backend
        const secondsLeft = data?.secondsLeft ?? 900;
        setLockedOut(true);
        setLockoutTimer(secondsLeft);
        const interval = setInterval(() => {
          setLockoutTimer((t) => {
            if (t <= 1) {
              clearInterval(interval);
              setLockedOut(false);
              setFailedAttempts(0);
              setShowCaptcha(false);
              setCaptchaVerified(false);
              return 0;
            }
            return t - 1;
          });
        }, 1000);
        addToast(data?.message ?? 'Account temporarily locked.', 'error');
        return;
      }

      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setErrors({ password: data?.message ?? 'Invalid email or password' });

      // Show captcha if backend says so, or after local threshold
      if (data?.requiresCaptcha || newAttempts >= MAX_ATTEMPTS) {
        setShowCaptcha(true);
        addToast('Multiple failed attempts — please complete CAPTCHA', 'warning');
      } else {
        const left = data?.attemptsLeft ?? (MAX_ATTEMPTS - newAttempts);
        addToast(`Invalid credentials. ${left} attempt(s) remaining`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AuthCard>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient-green">SecureAuth</h1>
          <p className="text-muted text-sm font-mono mt-1">Multi-Factor Authentication System</p>
        </div>

        <StepIndicator currentStep={1} />

        {/* Lockout banner */}
        {lockedOut && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-center gap-3 animate-fade-up">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p className="text-danger text-sm font-bold">Account Temporarily Locked</p>
              <p className="text-danger/70 text-xs font-mono">Retry in <span className="font-bold text-danger">{lockoutTimer}s</span></p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="animate-fade-up delay-100">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                disabled={lockedOut}
                className={`
                  w-full pl-10 pr-4 py-3.5 rounded-xl border bg-surface2 font-mono text-sm
                  text-[#e8eaf6] placeholder:text-muted outline-none transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${errors.email ? 'border-danger focus:border-danger shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    : 'border-border focus:border-accent/60 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'}
                `}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger font-mono flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="animate-fade-up delay-200">
            <label className="block text-xs font-mono font-medium text-muted uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="••••••••••••"
                disabled={lockedOut}
                className={`
                  w-full pl-10 pr-12 py-3.5 rounded-xl border bg-surface2 font-mono text-sm
                  text-[#e8eaf6] placeholder:text-muted outline-none transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${errors.password ? 'border-danger focus:border-danger shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    : 'border-border focus:border-accent/60 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-[#e8eaf6] transition-colors"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger font-mono flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* CAPTCHA */}
          {showCaptcha && !lockedOut && (
            <div className="animate-fade-up">
              <CaptchaWidget onVerify={(v) => { setCaptchaVerified(v); if (v) addToast('CAPTCHA verified!', 'success'); }} />
            </div>
          )}

          {/* Attempts warning */}
          {failedAttempts > 0 && !lockedOut && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-warning text-xs font-mono">
                {failedAttempts} failed attempt{failedAttempts > 1 ? 's' : ''} detected on this account
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || lockedOut}
            className="
              w-full py-3.5 rounded-xl font-bold text-sm bg-accent text-bg
              shadow-[0_0_25px_rgba(74,222,128,0.2)] hover:shadow-[0_0_35px_rgba(74,222,128,0.35)]
              hover:bg-accent/90 active:scale-[0.98] transition-all duration-200
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
                Verifying…
              </>
            ) : (
              <>
                Continue to OTP
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-border animate-fade-up delay-400 space-y-3">
          <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-accent font-mono transition-colors">
              Forgot password?
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>256-bit encrypted</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs text-muted font-mono">Don&apos;t have an account? </span>
            <Link href="/register" className="text-xs font-bold text-accent hover:text-accent/80 font-mono transition-colors">
              Create one →
            </Link>
          </div>
        </div>
      </AuthCard>
    </>
  );
}