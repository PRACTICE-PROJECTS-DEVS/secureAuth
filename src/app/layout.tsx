import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider, { ThemeScript } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'SecureAuth – MFA Authentication',
  description: 'Secure multi-factor authentication system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply saved theme before paint */}
        <ThemeScript />
      </head>
      <body className="noise min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
