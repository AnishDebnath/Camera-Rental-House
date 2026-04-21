import { CheckCheck, LucideIcon, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface CheckoutHeaderProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const CheckoutHeader = ({ steps, currentStep, onStepClick }: CheckoutHeaderProps) => {
  return (
    <header className="w-full mb-8">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-ink tracking-tight px-4">Checkout</h1>

        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar pb-2 px-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center shrink-0">
              <button
                onClick={() => onStepClick(i)}
                disabled={i > currentStep}
                className={`
                  flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300
                  ${i === currentStep
                    ? 'bg-primary text-white'
                    : i < currentStep
                      ? 'bg-success/10 text-success hover:bg-success/15'
                      : 'text-muted/70'
                  }
                `}
              >
                <div className={`
                  flex h-6 w-6 items-center justify-center rounded-full border transition-colors
                  ${i === currentStep ? 'border-white/30 bg-white/10' : i < currentStep ? 'border-success/20 bg-success/10' : 'border-line/60'}
                `}>
                  {i < currentStep ? <CheckCheck className="h-3.5 w-3.5" /> : <s.Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs font-bold whitespace-nowrap">{s.label}</span>
              </button>

              {i < steps.length - 1 && (
                <div className="mx-4 text-muted/90">
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
