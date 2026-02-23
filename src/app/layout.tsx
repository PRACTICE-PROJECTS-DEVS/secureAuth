import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="noise bg-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
