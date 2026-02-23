'use client';

interface Step {
  number: number;
  label: string;
  icon: string;
}

interface StepIndicatorProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, label: 'Password', icon: '🔑' },
  { number: 2, label: 'OTP', icon: '📧' },
  { number: 3, label: 'Biometric', icon: '🫆' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500
                  ${isCompleted
                    ? 'bg-accent text-bg shadow-[0_0_20px_rgba(74,222,128,0.4)]'
                    : isActive
                    ? 'bg-surface2 border-2 border-accent text-accent shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                    : 'bg-surface2 border border-border text-muted'
                  }
                `}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{step.number}</span>
                )}
                {isActive && (
                  <span className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-30" />
                )}
              </div>
              <span
                className={`text-xs font-medium tracking-wide font-mono ${
                  isActive ? 'text-accent' : isCompleted ? 'text-accent/70' : 'text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="mx-3 mb-5 flex items-center">
                <div
                  className={`h-px w-16 transition-all duration-700 ${
                    isCompleted ? 'bg-accent' : 'bg-border'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
