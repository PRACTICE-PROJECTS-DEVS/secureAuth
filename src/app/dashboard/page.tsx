'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUserEmail, removeToken, isAuthenticated } from '@/lib/auth';
import { ToastContainer, useToast } from '@/components/Toast';

const stats = [
  { label: 'Last Login', value: 'Just now', icon: '🕐', color: 'accent' },
  { label: 'Login Method', value: 'MFA (3-factor)', icon: '🔐', color: 'blue' },
  { label: 'Risk Score', value: 'Low', icon: '🛡️', color: 'accent' },
  { label: 'Session', value: 'Active', icon: '✅', color: 'accent' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [email, setEmail] = useState('');
  const [token, setTokenDisplay] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setEmail(getUserEmail() || 'user@example.com');
    const t = getToken() || '';
    setTokenDisplay(t.slice(0, 28) + '…');

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    addToast('Logged out successfully', 'success');
    setTimeout(() => router.push('/login'), 800);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-bg">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-border glass">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight">
                Secure<span className="text-accent">Auth</span>
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Protected Session
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-xs text-[#e8eaf6] font-mono font-medium">{email}</p>
                <p className="text-xs text-muted font-mono">{formatTime(time)}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all duration-200 font-mono"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          {/* Welcome */}
          <div className="animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#e8eaf6]">
                  Welcome back 👋
                </h1>
                <p className="text-muted font-mono text-sm mt-1">
                  {formatDate(time)} · All security checks passed
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/25 w-fit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-accent text-sm font-bold font-mono">Authentication Complete</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-100">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.06)]"
              >
                <div className="text-2xl mb-3">{stat.icon}</div>
                <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-sm font-bold text-[#e8eaf6]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* MFA Summary */}
          <div className="bg-surface border border-border rounded-2xl p-6 animate-fade-up delay-200">
            <h2 className="text-base font-bold text-[#e8eaf6] mb-5 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Authentication Summary
            </h2>
            <div className="space-y-3">
              {[
                { step: '01', label: 'Password Authentication', desc: 'Knowledge factor verified', color: '#4ade80' },
                { step: '02', label: 'OTP Verification', desc: 'Email possession confirmed', color: '#60a5fa' },
                { step: '03', label: 'Biometric Scan', desc: 'Inherence factor matched', color: '#f472b6' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 p-3.5 rounded-xl bg-surface2 border border-border">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-bg font-bold text-xs flex-shrink-0"
                    style={{ background: item.color, boxShadow: `0 0 15px ${item.color}40` }}
                  >
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e8eaf6]">{item.label}</p>
                    <p className="text-xs text-muted font-mono">{item.desc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      PASSED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token info */}
          <div className="bg-surface border border-border rounded-2xl p-6 animate-fade-up delay-300">
            <h2 className="text-base font-bold text-[#e8eaf6] mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Session Token
            </h2>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface2 border border-border">
              <span className="font-mono text-sm text-blue-accent truncate">{token}</span>
              <button
                onClick={() => addToast('Token copied to clipboard', 'info')}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-surface text-muted hover:text-[#e8eaf6] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-muted font-mono mt-2">JWT token stored in localStorage · Expires in 24h</p>
          </div>

          {/* Audit log */}
          <div className="bg-surface border border-border rounded-2xl p-6 animate-fade-up delay-400">
            <h2 className="text-base font-bold text-[#e8eaf6] mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Recent Activity Log
            </h2>
            <div className="space-y-2">
              {[
                { time: formatTime(new Date()), event: 'Biometric verification succeeded', level: 'success' },
                { time: formatTime(new Date(Date.now() - 30000)), event: 'OTP verified from email', level: 'success' },
                { time: formatTime(new Date(Date.now() - 60000)), event: 'Password authentication passed', level: 'success' },
                { time: formatTime(new Date(Date.now() - 90000)), event: 'Login attempt initiated', level: 'info' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-surface2 transition-colors">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${log.level === 'success' ? 'bg-accent' : 'bg-blue-accent'}`}
                  />
                  <span className="text-xs text-muted font-mono w-20 flex-shrink-0">{log.time}</span>
                  <span className="text-xs text-[#e8eaf6] font-mono">{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
