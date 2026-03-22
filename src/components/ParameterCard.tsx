"use client";

interface ParameterCardProps {
  label: string;
  value: string;
  subtitle: string;
  showStepper?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function ParameterCard({
  label,
  value,
  subtitle,
  showStepper = true,
  onIncrement,
  onDecrement,
}: ParameterCardProps) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-card bg-bg-card px-3.5 py-3">
      {/* Content */}
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-[10px] text-text-secondary">{label}</span>
        <span className="text-2xl font-semibold text-text-primary">
          {value}
        </span>
        <span className="text-[10px] text-text-muted">{subtitle}</span>
      </div>

      {/* Stepper */}
      {showStepper && (
        <div className="flex flex-col gap-1">
          <button
            onClick={onIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-text-muted/40 text-[9px] text-text-secondary opacity-50 transition-opacity hover:opacity-80"
          >
            ▲
          </button>
          <button
            onClick={onDecrement}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-text-muted/40 text-[9px] text-text-secondary opacity-50 transition-opacity hover:opacity-80"
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}
