'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken, isAuthenticated } from '@/lib/auth';
import { ToastContainer, useToast } from '@/components/Toast';
import ThemeToggle from '@/components/ThemeToggle';
import api from '@/lib/axios';

interface UserData {
  id: string;
  email: string;
  accountStatus: string;
  lastLoginAt: string | null;
  createdAt: string;
}

interface ActivityEntry {
  id: string;
  attemptType: string;
  success: boolean;
  failureReason: string | null;
  riskScore: number;
  attemptTime: string;
  ipAddress: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [token, setTokenDisplay] = useState('');
  const [time, setTime] = useState(new Date());
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }

    const t = getToken() || '';
    setTokenDisplay(t.slice(0, 28) + '…');

    const fetchData = async () => {
      try {
        const [meRes, activityRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/auth/activity'),
        ]);
        setUser(meRes.data.data.user);
        setActivity(activityRes.data.data.attempts.slice(-6).reverse());
      } catch (err: any) {
        if (err?.response?.status === 401) { removeToken(); router.push('/login'); }
        else addToast('Failed to load profile data', 'error');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    removeToken();
    addToast('Logged out successfully', 'success');
    setTimeout(() => router.push('/login'), 800);
  };

  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const fmtRel  = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000)   return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const stats = [
    { label: 'Last Login',      value: user?.lastLoginAt ? fmtRel(user.lastLoginAt) : 'Now', icon: '🕐' },
    { label: 'Login Method',    value: 'MFA (3-factor)',  icon: '🔐' },
    { label: 'Risk Score',      value: activity[0]?.riskScore !== undefined ? (activity[0].riskScore < 40 ? 'Low' : activity[0].riskScore < 70 ? 'Medium' : 'High') : 'Low', icon: '🛡️' },
    { label: 'Account Status',  value: user?.accountStatus ?? 'Active', icon: '✅' },
  ];

  // ─── Shared style helpers ──────────────────────────────────────────────────
  const card = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '1rem',
    padding: '1.5rem',
  } as React.CSSProperties;

  const innerCard = {
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.75rem',
  } as React.CSSProperties;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--color-bg)' }}>

        {/* Top bar */}
        <header
          className="sticky top-0 z-50 glass"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent-dim)', border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight" style={{ color: 'var(--color-text)' }}>
                Secure<span style={{ color: 'var(--color-accent)' }}>Auth</span>
              </span>
              <span
                className="hidden sm:flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ color: 'var(--color-accent)', background: 'var(--color-accent-dim)', border: '1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }} />
                Protected Session
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-mono font-medium" style={{ color: 'var(--color-text)' }}>{user?.email ?? '…'}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>{fmtTime(time)}</p>
              </div>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-mono transition-all duration-200"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">

          {/* Welcome */}
          <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {loadingData ? (
                <div className="space-y-2">
                  <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: 'var(--color-surface2)' }} />
                  <div className="h-4 w-64 rounded-lg animate-pulse" style={{ background: 'var(--color-surface2)' }} />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>Welcome back 👋</h1>
                  <p className="text-sm font-mono mt-1" style={{ color: 'var(--color-muted)' }}>{fmtDate(time)} · All security checks passed</p>
                </>
              )}
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl w-fit"
              style={{ background: 'var(--color-accent-dim)', border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-accent)' }}>Authentication Complete</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-100">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl p-5 transition-all duration-300" style={card}>
                <div className="text-2xl mb-3">{stat.icon}</div>
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted)' }}>{stat.label}</p>
                {loadingData
                  ? <div className="h-4 w-20 rounded animate-pulse" style={{ background: 'var(--color-surface2)' }} />
                  : <p className="text-sm font-bold capitalize" style={{ color: 'var(--color-text)' }}>{stat.value}</p>
                }
              </div>
            ))}
          </div>

          {/* MFA Summary */}
          <div className="rounded-2xl animate-fade-up delay-200" style={card}>
            <h2 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Authentication Summary
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Password Authentication', desc: 'Knowledge factor verified',  color: 'var(--color-accent)' },
                { label: 'OTP Verification',        desc: 'Email possession confirmed', color: 'var(--color-blue-accent)' },
                { label: 'Biometric Scan',          desc: 'Inherence factor matched',   color: 'var(--color-pink-accent)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-3.5 rounded-xl" style={innerCard}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: item.color, color: 'var(--color-bg)', boxShadow: `0 0 14px color-mix(in srgb, ${item.color} 30%, transparent)` }}>
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>{item.desc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)' }}>
                      PASSED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token */}
          <div className="rounded-2xl animate-fade-up delay-300" style={card}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Session Token
            </h2>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={innerCard}>
              <span className="font-mono text-sm truncate" style={{ color: 'var(--color-blue-accent)' }}>{token}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(getToken() || ''); addToast('Token copied to clipboard', 'info'); }}
                className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
            <p className="text-xs font-mono mt-2" style={{ color: 'var(--color-muted)' }}>JWT stored in localStorage · Expires in 24h</p>
          </div>

          {/* Activity log */}
          <div className="rounded-2xl animate-fade-up delay-400" style={card}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              Recent Activity Log
            </h2>
            <div className="space-y-1">
              {loadingData ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'var(--color-surface2)' }} />
                ))
              ) : activity.length > 0 ? (
                activity.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: log.success ? 'var(--color-accent)' : '#f87171' }} />
                    <span className="text-xs font-mono w-20 flex-shrink-0" style={{ color: 'var(--color-muted)' }}>{fmtRel(log.attemptTime)}</span>
                    <span className="text-xs font-mono capitalize" style={{ color: 'var(--color-text)' }}>
                      {log.attemptType} authentication {log.success ? 'succeeded' : `failed${log.failureReason ? ` — ${log.failureReason.replace(/_/g, ' ')}` : ''}`}
                    </span>
                    {log.riskScore > 0 && (
                      <span className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          color: log.riskScore < 40 ? 'var(--color-accent)' : log.riskScore < 70 ? '#fbbf24' : '#f87171',
                          background: log.riskScore < 40 ? 'var(--color-accent-dim)' : log.riskScore < 70 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)',
                          border: `1px solid ${log.riskScore < 40 ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)' : log.riskScore < 70 ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'}`,
                        }}>
                        Risk {log.riskScore}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm font-mono text-center py-4" style={{ color: 'var(--color-muted)' }}>No activity recorded yet</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
