"use client";

type TimerState = "running" | "ready" | "complete" | "done" | "empty";

interface TimerCircleProps {
  state: TimerState;
  timeDisplay?: string;
  subtitle?: string;
  progress?: number; // 0 to 1, elapsed fraction (0 = start, 1 = done)
}

const stateConfig: Record<
  TimerState,
  { defaultText: string; defaultSub: string }
> = {
  running: { defaultText: "0:45", defaultSub: "remaining" },
  ready: { defaultText: "0:15", defaultSub: "ready" },
  complete: { defaultText: "0:00", defaultSub: "pour now" },
  done: { defaultText: "茶", defaultSub: "well brewed" },
  empty: { defaultText: "茶", defaultSub: "" },
};

export function TimerCircle({
  state,
  timeDisplay,
  subtitle,
  progress = 0,
}: TimerCircleProps) {
  const config = stateConfig[state];
  const display = timeDisplay ?? config.defaultText;
  const sub = subtitle ?? config.defaultSub;

  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Progress ring: gold that depletes as time passes
  // ready: full gold ring (dashOffset = 0)
  // running: gold shrinks from full to empty (dashOffset increases with progress)
  // complete: progress ring hidden (opacity 0), track becomes green
  // empty: muted ring
  const isRunning = state === "running";
  const isComplete = state === "complete" || state === "done";
  const isEmpty = state === "empty";

  const dashOffset = isRunning ? circumference * progress : 0;
  const progressOpacity = isComplete ? 0 : isEmpty ? 0.3 : 1;

  const isLargeText = display === "茶";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-90 -scale-x-100">
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B8E60" />
            <stop offset="100%" stopColor="#8BAF80" />
          </linearGradient>
        </defs>
        {/* Track: brown border normally, green gradient when complete */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? "url(#greenGradient)" : undefined}
          className={isComplete ? undefined : "stroke-border"}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring: accent gold, depletes during brewing */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={isEmpty ? "stroke-text-muted" : "stroke-accent-gold"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={progressOpacity}
          style={{ transition: "stroke-dashoffset 1s ease-in-out, opacity 0.3s ease" }}
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
