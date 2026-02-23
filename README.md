# SecureAuth – MFA Frontend UI

A production-grade multi-factor authentication frontend built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Pages

| Route | Description |
|---|---|
| `/login` | Step 1 – Email + password with brute-force protection |
| `/verify-otp` | Step 2 – 6-digit OTP email verification |
| `/verify-biometric` | Step 3 – Fingerprint biometric scan (POC) |
| `/dashboard` | Protected dashboard after full MFA |

## Features

- ✅ Multi-step progress indicator
- ✅ Animated 6-box OTP input with auto-focus
- ✅ Progressive lockout + countdown timer
- ✅ CAPTCHA after 3 failed attempts
- ✅ Show/hide password toggle
- ✅ Biometric scanner animation (POC)
- ✅ Toast notification system
- ✅ JWT token management
- ✅ Protected route redirection
- ✅ Audit activity log on dashboard
- ✅ Resend OTP with 60s cooldown
- ✅ Responsive dark UI

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- **Any email** + password: `password123`
- **OTP code**: `123456`
- **Biometric**: Click "Begin Scan" (simulated, ~90% success)

## Connect to Backend

Edit `src/lib/axios.ts`:
```ts
baseURL: 'http://localhost:5000/api'
```

Replace mock logic in each page with real `api.post(...)` calls:
- `POST /api/auth/login` → `{ email, password }`
- `POST /api/auth/verify-otp` → `{ userId, otp }`
- `POST /api/auth/verify-biometric` → `{ userId }`

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx
│   ├── verify-otp/page.tsx
│   ├── verify-biometric/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── AuthCard.tsx         # Wrapper with background effects
│   ├── StepIndicator.tsx    # MFA progress steps
│   ├── OtpInput.tsx         # 6-box OTP input
│   ├── CaptchaWidget.tsx    # reCAPTCHA placeholder
│   ├── BiometricScanner.tsx # Fingerprint scanner UI
│   └── Toast.tsx            # Notification system + hook
└── lib/
    ├── axios.ts             # API client
    └── auth.ts              # Token helpers
```
