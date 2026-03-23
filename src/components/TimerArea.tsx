"use client";

import { TimerCircle } from "./TimerCircle";
import { Tea, TeaType, RoastLevel } from "@/types/tea";
import { BrewingSessionState, BrewingActions } from "@/hooks/useBrewingSession";

interface TimerAreaProps {
  tea: Tea;
  sessionState: BrewingSessionState;
  actions: BrewingActions;
}

const TEA_TYPE_LABELS: Record<TeaType, string> = {
  green: "Green Tea",
  white: "White Tea",
  oolong: "Oolong",
  black: "Black Tea",
  "puerh-raw": "Pu-erh (Raw)",
  "puerh-ripe": "Pu-erh (Ripe)",
  yellow: "Yellow Tea",
};

const ROAST_LABELS: Record<RoastLevel, string> = {
  none: "",
  light: "Light Roast",
  medium: "Medium Roast",
  heavy: "Heavy Roast",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatSessionTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
}

export function TimerArea({ tea, sessionState, actions }: TimerAreaProps) {
  const {
    brewingState,
    currentInfusion,
    totalInfusions,
    secondsRemaining,
    currentSteepSeconds,
    completedInfusions,
  } = sessionState;

  const typeLabel = TEA_TYPE_LABELS[tea.type];
  const roastLabel = ROAST_LABELS[tea.roastLevel];
  const description = [typeLabel, tea.origin, roastLabel].filter(Boolean).join("  ·  ");

  // Timer circle state mapping
  let timerState: "ready" | "running" | "complete";
  if (brewingState === "ready") {
    timerState = "ready";
  } else if (brewingState === "complete") {
    timerState = "complete";
  } else {
    timerState = "running";
  }

  // Progress as elapsed fraction (0 = start, 1 = fully elapsed)
  const progress =
    currentSteepSeconds > 0
      ? (currentSteepSeconds - secondsRemaining) / currentSteepSeconds
      : 0;

  const timeDisplay = formatTime(secondsRemaining);

  // Next brew steep time for the button label
  const nextInfusionIndex = currentInfusion + 1;
  const hasNextInfusion = nextInfusionIndex < totalInfusions;
  const nextSteepSeconds = hasNextInfusion
    ? tea.brewingParameters.baseSteepSeconds +
      nextInfusionIndex * tea.brewingParameters.steepIncrementSeconds
    : 0;

  return (
    <main className="flex flex-1 flex-col items-center justify-between bg-bg-dark overflow-hidden">
      {/* Header */}
      <div className="text-center pb-8 pt-10 px-16">
        <h1 className="text-[32px] font-bold text-text-primary">
          {tea.name}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>

      {/* Infusion label */}
      <div className="text-center pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          Infusion
        </p>
        <p className="text-sm font-semibold text-accent-gold">
          {currentInfusion + 1} / {totalInfusions}
        </p>
      </div>

      {/* Timer */}
      <TimerCircle
        state={timerState}
        timeDisplay={timeDisplay}
        progress={timerState === "running" ? progress : undefined}
      />

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 pt-6">
        {brewingState === "ready" && (
          <button
            onClick={actions.start}
            className="h-12 w-56 rounded-btn-primary bg-accent-gold text-base font-semibold text-bg-dark transition-colors hover:bg-accent-gold/90"
          >
            Start Brewing
          </button>
        )}

        {(brewingState === "running" || brewingState === "paused") && (
          <>
            <button
              onClick={brewingState === "running" ? actions.pause : actions.resume}
              className="h-12 w-56 rounded-btn-primary bg-accent-gold text-base font-semibold text-bg-dark transition-colors hover:bg-accent-gold/90"
            >
              {brewingState === "running" ? "Pause" : "Resume"}
            </button>
            <div className="flex gap-2 w-[211px]">
              <button
                onClick={actions.reset}
                className="flex-1 h-10 rounded-btn-secondary border-[1.5px] border-border text-[13px] font-medium text-text-secondary transition-colors hover:border-text-muted"
              >
                Reset
              </button>
              <button
                onClick={actions.skip}
                className="flex-1 h-10 rounded-btn-secondary border-[1.5px] border-border text-[13px] font-medium text-text-secondary transition-colors hover:border-text-muted"
              >
                Skip →
              </button>
            </div>
          </>
        )}

        {brewingState === "complete" && (
          <>
            {hasNextInfusion ? (
              <button
                onClick={actions.pourAndNext}
                className="h-12 w-56 rounded-btn-primary bg-accent-gold text-base font-semibold text-bg-dark transition-colors hover:bg-accent-gold/90"
              >
                Next Brew ({nextSteepSeconds}s)
              </button>
            ) : (
              <button
                onClick={actions.endSession}
                className="h-12 w-56 rounded-btn-primary bg-accent-gold text-base font-semibold text-bg-dark transition-colors hover:bg-accent-gold/90"
              >
                End Session
              </button>
            )}
            <div className="flex gap-2 w-[211px]">
              <button
                onClick={actions.endSession}
                className="flex-1 h-10 rounded-btn-secondary border-[1.5px] border-border text-[13px] font-medium text-text-secondary transition-colors hover:border-text-muted"
              >
                End Session
              </button>
              <button
                onClick={actions.skip}
                className="flex-1 h-10 rounded-btn-secondary border-[1.5px] border-border text-[13px] font-medium text-text-secondary transition-colors hover:border-text-muted"
              >
                Skip →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Infusion dots */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex gap-3">
          {Array.from({ length: totalInfusions }).map((_, i) => {
            const isCompleted = i < completedInfusions.length;
            const isCurrent = i === currentInfusion;
            return (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${
                  isCompleted
                    ? "bg-semantic-green"
                    : isCurrent
                    ? "border-2 border-accent-gold bg-transparent"
                    : "bg-text-muted/30"
                }`}
              />
            );
          })}
        </div>
        <span className="text-[11px] text-text-muted">Infusions brewed</span>
      </div>

      {/* Tip */}
      <div className="w-full px-16 pb-10">
        <div className="rounded-card bg-bg-card px-5 py-4">
          <p className="text-sm text-text-secondary">
            💡 {brewingState === "complete"
              ? "Pour promptly to avoid over-extraction. The leaves continue to steep until drained."
              : tea.tip}
          </p>
        </div>
      </div>
    </main>
  );
}
