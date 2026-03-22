"use client";

import { Tea, TeaType } from "@/types/tea";

interface SidebarProps {
  teas: Tea[];
  selectedTeaId: string;
  onSelectTea: (id: string) => void;
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

export function Sidebar({ teas, selectedTeaId, onSelectTea }: SidebarProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col bg-bg-sidebar border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-8 py-6">
        <div className="h-7 w-7 rounded-full bg-accent-gold" />
        <span className="text-lg font-semibold text-text-primary">
          茶  CháTime
        </span>
      </div>

      <div className="mx-8 border-t border-border" />

      {/* Search */}
      <div className="px-8 py-3">
        <div className="flex items-center gap-2.5 rounded-input bg-bg-input px-3.5 py-2.5">
          <span className="text-text-muted text-sm">○</span>
          <span className="text-sm text-text-muted">Search teas...</span>
        </div>
      </div>

      {/* Sort */}
      <div className="px-8 pt-1 pb-3">
        <p className="mb-2 text-[9px] font-semibold uppercase text-text-muted">
          SORT BY
        </p>
        <div className="flex gap-1.5">
          <button className="rounded-input bg-accent-gold/15 px-2.5 py-1.5 text-xs font-semibold text-accent-gold">
            All
          </button>
          <button className="rounded-input px-2.5 py-1.5 text-xs font-medium text-text-muted">
            By Type  ▾
          </button>
          <button className="rounded-input px-2.5 py-1.5 text-xs font-medium text-text-muted">
            Recent
          </button>
        </div>
      </div>

      {/* Tea List */}
      <div className="flex-1 overflow-y-auto">
        {teas.map((tea) => {
          const isActive = tea.id === selectedTeaId;
          const typeLabel = TEA_TYPE_LABELS[tea.type];
          const subtitle = isActive && tea.origin
            ? `${typeLabel} · ${tea.origin.split(",")[0]}`
            : typeLabel;
          return (
            <button
              key={tea.id}
              onClick={() => onSelectTea(tea.id)}
              className={`flex w-full items-center gap-3 px-8 py-3 text-left transition-colors ${
                isActive
                  ? "border-l-[3px] border-accent-gold bg-accent-gold/[0.07]"
                  : "border-l-[3px] border-transparent hover:bg-bg-card/30"
              }`}
            >
              <div
                className={`h-2 w-2 shrink-0 rounded-full ${
                  isActive ? "bg-accent-gold" : "bg-text-muted/40"
                }`}
              />
              <div className="flex flex-col gap-1 overflow-hidden">
                <span
                  className={`text-sm truncate ${
                    isActive
                      ? "font-semibold text-accent-gold"
                      : "font-medium text-text-primary"
                  }`}
                >
                  {tea.name}
                </span>
                <span className="text-[11px] text-text-secondary">{subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Custom Tea */}
      <div className="px-8 pb-4">
        <button className="w-full rounded-input border-[1.5px] border-dashed border-border py-3 text-[13px] font-medium text-text-muted transition-colors hover:border-text-muted hover:text-text-secondary">
          +   Add Custom Tea
        </button>
      </div>

      <div className="mx-8 border-t border-border" />

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4">
        <span className="text-xs text-text-secondary">Settings</span>
        <span className="text-[11px] text-text-muted">v2.1.0</span>
      </div>
    </aside>
  );
}
