'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/AuthCard';
import StepIndicator from '@/components/StepIndicator';
import BiometricScanner from '@/components/BiometricScanner';
import { ToastContainer, useToast } from '@/components/Toast';
import { setToken, getUserId } from '@/lib/auth';
import api from '@/lib/axios';

export default function VerifyBiometricPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [result, setResult] = useState<'pending' | 'success' | 'failure'>('pending');
  const [loading, setLoading] = useState(false);

  const handleBiometricResult = async (success: boolean) => {
    if (!success) {
      addToast('Biometric scan failed. Please try again or use backup method.', 'error');
      setResult('failure');
      return;
    }

    setResult('success');
    setLoading(true);

    try {
      // --- MOCK CALL (replace with real API) ---
      // const res = await api.post('/auth/verify-biometric', { userId: getUserId() });
      // setToken(res.data.token);
      await new Promise((r) => setTimeout(r, 800));
      setToken('mock-jwt-token-' + Date.now());

      addToast('All factors verified! Access granted.', 'success');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch {
      addToast('Authentication failed. Please try again.', 'error');
      setResult('failure');
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 relative"
            style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <span className="text-[8px] font-bold text-bg">✓</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{
            background: 'linear-gradient(135deg, #f472b6, #fb923c)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            Biometric Scan
          </h1>
          <p className="text-muted text-sm font-mono mt-1">Inherence Factor Verification</p>
        </div>

        <StepIndicator currentStep={3} />

        {/* Why triggered */}
        <div className="mb-6 p-3.5 rounded-xl bg-surface2 border border-border flex items-start gap-3 animate-fade-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <p className="text-xs font-bold text-warning font-mono">Risk Check Triggered</p>
            <p className="text-xs text-muted font-mono mt-0.5">New device or suspicious activity detected. Additional verification required.</p>
          </div>
        </div>

        {/* Scanner */}
        <div className="animate-fade-up delay-200">
          <BiometricScanner onResult={handleBiometricResult} />
        </div>

        {/* Loading overlay feedback */}
        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-mono text-accent animate-fade-in">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Finalizing authentication…
          </div>
        )}

        {/* Backup method */}
        <div className="mt-6 pt-5 border-t border-border text-center animate-fade-up delay-300">
          <p className="text-xs text-muted font-mono mb-2">Having trouble?</p>
          <button
            onClick={() => addToast('Backup method: Check your email for a recovery code.', 'info')}
            className="text-sm text-pink-accent font-semibold hover:text-pink-accent/80 transition-colors font-mono"
            style={{ color: '#f472b6' }}
          >
            Use backup verification method →
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-[#e8eaf6] font-mono transition-colors mx-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
            </svg>
            Start over
          </button>
        </div>

        {/* POC notice */}
        <div className="mt-4 p-3 rounded-lg border" style={{ background: 'rgba(244,114,182,0.07)', borderColor: 'rgba(244,114,182,0.2)' }}>
          <p className="text-xs font-mono text-center" style={{ color: '#f472b6' }}>
            Proof-of-concept — simulated biometric matching
          </p>
        </div>
      </AuthCard>
    </>
  );
}
