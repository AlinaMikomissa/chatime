"use client";

import { ParameterCard } from "./ParameterCard";
import { Tea } from "@/types/tea";
import { BrewingSessionState } from "@/hooks/useBrewingSession";

interface DetailsPanelProps {
  tea: Tea;
  sessionState: BrewingSessionState;
}

function formatSessionTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
}

export function DetailsPanel({ tea, sessionState }: DetailsPanelProps) {
  const { brewingParameters, flavorProfile } = tea;
  const isActive = sessionState.brewingState !== "ready";

  return (
    <aside className="flex w-[440px] shrink-0 flex-col gap-10 bg-bg-dark border-l border-border px-8 pt-10 pb-6 overflow-y-auto">
      {/* Brewing Parameters */}
      <section className="flex flex-col gap-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          Brewing Parameters
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <ParameterCard
              label="Water Temp"
              value={`${brewingParameters.waterTempCelsius}°C`}
              subtitle="Near boiling"
            />
            <ParameterCard
              label="Tea Amount"
              value={`${brewingParameters.teaAmountGrams}g`}
              subtitle={`Per ${brewingParameters.waterVolumeMl}ml`}
            />
          </div>
          <div className="flex gap-3">
            <ParameterCard
              label="Water Vol."
              value={`${brewingParameters.waterVolumeMl}ml`}
              subtitle="Gàiwǎn"
            />
            <ParameterCard
              label="Infusions"
              value={`${brewingParameters.infusionCount.min}–${brewingParameters.infusionCount.max}`}
              subtitle="Avg. total"
            />
          </div>
          <div className="flex gap-3">
            <ParameterCard
              label="Base Steep"
              value={`${brewingParameters.baseSteepSeconds}s`}
              subtitle="First infusion"
            />
            <ParameterCard
              label="Increment"
              value={`+${brewingParameters.steepIncrementSeconds}s`}
              subtitle="Per next steep"
            />
          </div>
        </div>
      </section>

      {/* Flavor Profile */}
      <section className="flex flex-col gap-2.5">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          Flavor Profile
        </h3>
        <div className="flex flex-wrap gap-2">
          {flavorProfile.map((tag) => (
            <span
              key={tag}
              className="rounded-tag border border-border bg-bg-card px-3 py-1.5 text-[11px] font-medium text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Session Notes */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            Session Notes
          </h3>
          <button className="text-[10px] font-medium text-text-muted hover:text-text-secondary">
            ▾ Hide
          </button>
        </div>
        <div className="rounded-card bg-bg-card px-4 py-3.5">
          <p className="text-sm leading-relaxed text-text-secondary">
            {isActive
              ? "Tap to add tasting notes for this session…"
              : "Tap to add tasting notes for this session…"}
          </p>
        </div>
      </section>

      <div className="flex-1" />

      {/* Session Timer */}
      <div className="text-right">
        <span className="text-[11px] text-text-muted">
          Session: {formatSessionTime(sessionState.sessionElapsedSeconds)}
        </span>
      </div>
    </aside>
  );
}
