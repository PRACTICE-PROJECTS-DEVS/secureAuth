'use client';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, label: 'Password' },
  { number: 2, label: 'OTP' },
  { number: 3, label: 'Biometric' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                style={{
                  background: isCompleted
                    ? 'var(--color-accent)'
                    : 'var(--color-surface2)',
                  border: isCompleted
                    ? '2px solid var(--color-accent)'
                    : isActive
                    ? '2px solid var(--color-accent)'
                    : '1px solid var(--color-border)',
                  color: isCompleted
                    ? 'var(--color-bg)'
                    : isActive
                    ? 'var(--color-accent)'
                    : 'var(--color-muted)',
                  boxShadow: isCompleted || isActive
                    ? '0 0 20px color-mix(in srgb, var(--color-accent) 30%, transparent)'
                    : 'none',
                }}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full border-2 animate-ping opacity-30"
                    style={{ borderColor: 'var(--color-accent)' }}
                  />
                )}
              </div>
              <span
                className="text-xs font-medium tracking-wide font-mono"
                style={{
                  color: isActive
                    ? 'var(--color-accent)'
                    : isCompleted
                    ? 'var(--color-accent)'
                    : 'var(--color-muted)',
                  opacity: isCompleted ? 0.7 : 1,
                }}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-3 mb-5 flex items-center">
                <div
                  className="h-px w-16 transition-all duration-700"
                  style={{ background: isCompleted ? 'var(--color-accent)' : 'var(--color-border)' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
