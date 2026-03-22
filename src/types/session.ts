export interface InfusionRecord {
  index: number;
  plannedSeconds: number;
  actualSeconds: number;
  skipped: boolean;
}

export interface BrewingSession {
  id: string;
  teaId: string;
  startedAt: string; // ISO 8601
  completedAt: string | null;
  infusions: InfusionRecord[];
  notes: string;
  rating: number | null; // 1–5, null if unrated
}

export function createSession(teaId: string): BrewingSession {
  return {
    id: crypto.randomUUID(),
    teaId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    infusions: [],
    notes: "",
    rating: null,
  };
}
