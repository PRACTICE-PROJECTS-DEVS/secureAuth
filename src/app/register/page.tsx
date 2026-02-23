'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';
import { ToastContainer, useToast } from '@/components/Toast';
import api from '@/lib/axios';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordStrength {
  score: number;       // 0-4
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#f87171', '#fb923c', '#fbbf24', '#4ade80', '#22d3ee'];
  return { score, label: labels[score] || '', color: colors[score] || '', checks };
};

export default function RegisterPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';

    if (!password) errs.password = 'Password is required';
    else if (strength.score < 3) errs.password = 'Password is too weak — meet all requirements below';

    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // ─── REAL API CALL ────────────────────────────────────────────────────
      await api.post('/auth/register', { email, password });
      // ─────────────────────────────────────────────────────────────────────

      setSuccess(true);
      addToast('Account created! Redirecting to login…', 'success');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Registration failed. Please try again.';

      if (err?.response?.status === 409) {
        setErrors({ email: 'An account with this email already exists' });
      } else {
        addToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Eye icon
  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
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
    );

  // Error message
  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="mt-1.5 text-xs text-danger font-mono flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {msg}
      </p>
    ) : null;

  if (success) {
    return (
      <AuthCard>
        <div className="text-center py-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/15 border-2 border-accent mb-6 shadow-[0_0_40px_rgba(74,222,128,0.25)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gradient-green mb-2">Account Created!</h2>
          <p className="text-[var(--color-muted)] font-mono text-sm">Redirecting you to login…</p>
          <div className="mt-6 flex justify-center">
            <svg className="animate-spin w-5 h-5 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AuthCard>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent-dim)] border border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)] mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="12" y1="11" x2="12" y2="15"/>
              <line x1="10" y1="13" x2="14" y2="13"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient-green">Create Account</h1>
          <p className="text-[var(--color-muted)] text-sm font-mono mt-1">Join SecureAuth — MFA protected</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="animate-fade-up delay-100">
            <label className="block text-xs font-mono font-medium text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
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
                className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-[var(--color-surface2)] font-mono text-sm
                  text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-all duration-200
                  ${errors.email
                    ? 'border-danger focus:border-danger shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    : 'border-[var(--color-border)] focus:border-accent/60 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'}`}
              />
            </div>
            <FieldError msg={errors.email} />
          </div>

          {/* Password */}
          <div className="animate-fade-up delay-200">
            <label className="block text-xs font-mono font-medium text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="Create a strong password"
                className={`w-full pl-10 pr-12 py-3.5 rounded-xl border bg-[var(--color-surface2)] font-mono text-sm
                  text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-all duration-200
                  ${errors.password
                    ? 'border-danger focus:border-danger shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    : 'border-[var(--color-border)] focus:border-accent/60 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.score ? strength.color : 'var(--color-border)' }} />
                  ))}
                </div>
                <p className="text-xs font-mono" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}

            <FieldError msg={errors.password} />

            {/* Requirements checklist */}
            {password.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {[
                  { key: 'length', label: '8+ characters' },
                  { key: 'uppercase', label: 'Uppercase letter' },
                  { key: 'lowercase', label: 'Lowercase letter' },
                  { key: 'number', label: 'Number' },
                  { key: 'special', label: 'Special character' },
                ].map(({ key, label }) => {
                  const met = strength.checks[key as keyof typeof strength.checks];
                  return (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${met ? 'bg-accent/20 border border-accent' : 'bg-[var(--color-surface2)] border border-[var(--color-border)]'}`}>
                        {met && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-[11px] font-mono transition-colors ${met ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="animate-fade-up delay-300">
            <label className="block text-xs font-mono font-medium text-[var(--color-muted)] uppercase tracking-widest mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                placeholder="Re-enter your password"
                className={`w-full pl-10 pr-12 py-3.5 rounded-xl border bg-[var(--color-surface2)] font-mono text-sm
                  text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none transition-all duration-200
                  ${errors.confirmPassword
                    ? 'border-danger focus:border-danger shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    : confirmPassword && confirmPassword === password
                    ? 'border-accent/60 shadow-[0_0_10px_rgba(74,222,128,0.08)]'
                    : 'border-[var(--color-border)] focus:border-accent/60 focus:shadow-[0_0_12px_rgba(74,222,128,0.1)]'}`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {confirmPassword && confirmPassword === password && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>
            <FieldError msg={errors.confirmPassword} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-[var(--color-accent)] text-[var(--color-bg)]
              shadow-[0_0_25px_rgba(74,222,128,0.2)] hover:shadow-[0_0_35px_rgba(74,222,128,0.35)]
              hover:bg-[color-mix(in_srgb,var(--color-accent)_90%,transparent)] active:scale-[0.98] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              flex items-center justify-center gap-2 animate-fade-up delay-400 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border)] flex items-center justify-between animate-fade-up delay-500">
          <span className="text-xs text-[var(--color-muted)] font-mono">Already have an account?</span>
          <Link href="/login"
            className="text-xs font-bold text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 font-mono transition-colors flex items-center gap-1">
            Sign in
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted)] font-mono">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Passwords hashed with bcrypt · MFA enforced on login</span>
        </div>
      </AuthCard>
    </>
  );
}
