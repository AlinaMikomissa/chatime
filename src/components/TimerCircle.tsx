"use client";

type TimerState = "running" | "ready" | "complete" | "done" | "empty";

interface TimerCircleProps {
  state: TimerState;
  timeDisplay?: string;
  subtitle?: string;
  progress?: number; // 0 to 1, used for running state
}

const stateConfig: Record<
  TimerState,
  { ringColor: string; defaultText: string; defaultSub: string }
> = {
  running: { ringColor: "stroke-accent-gold", defaultText: "0:45", defaultSub: "remaining" },
  ready: { ringColor: "stroke-accent-gold", defaultText: "0:15", defaultSub: "ready" },
  complete: { ringColor: "stroke-semantic-green", defaultText: "0:00", defaultSub: "pour now" },
  done: { ringColor: "stroke-semantic-green", defaultText: "茶", defaultSub: "well brewed" },
  empty: { ringColor: "stroke-text-muted", defaultText: "茶", defaultSub: "" },
};

export function TimerCircle({
  state,
  timeDisplay,
  subtitle,
  progress = 0.67,
}: TimerCircleProps) {
  const config = stateConfig[state];
  const display = timeDisplay ?? config.defaultText;
  const sub = subtitle ?? config.defaultSub;

  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // For running state, show partial arc; others show full ring
  const isPartial = state === "running";
  const dashOffset = isPartial ? circumference * (1 - progress) : 0;
  const ringOpacity = state === "empty" ? 0.3 : 1;

  const isLargeText = display === "茶";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={config.ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={ringOpacity}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>

      {/* Inner circle background */}
      <div
        className="absolute rounded-full bg-bg-card"
        style={{
          top: strokeWidth + 6,
          left: strokeWidth + 6,
          width: size - (strokeWidth + 6) * 2,
          height: size - (strokeWidth + 6) * 2,
        }}
      />

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-light text-text-primary ${
            isLargeText ? "text-[64px]" : "text-[72px]"
          }`}
        >
          {display}
        </span>
        {sub && (
          <span className="text-xs text-text-secondary">{sub}</span>
        )}
      </div>
    </div>
  );
}
