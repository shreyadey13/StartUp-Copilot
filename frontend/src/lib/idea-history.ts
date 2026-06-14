import type { IdeaValidationHistoryEntry } from "@/lib/api/types";

export const IDEA_HISTORY_KEY = "ai-startup-copilot-idea-validation-history";

export function loadIdeaHistory(): IdeaValidationHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(IDEA_HISTORY_KEY);
    return stored ? normalizeHistory(JSON.parse(stored) as IdeaValidationHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveIdeaHistory(entries: IdeaValidationHistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(IDEA_HISTORY_KEY, JSON.stringify(entries));
}

export function upsertIdeaHistory(entry: IdeaValidationHistoryEntry) {
  const entries = [entry, ...loadIdeaHistory().filter((item) => item.id !== entry.id)].slice(0, 12);
  saveIdeaHistory(entries);
  return entries;
}

function normalizeHistory(entries: IdeaValidationHistoryEntry[]): IdeaValidationHistoryEntry[] {
  return entries.map((entry) => ({
    ...entry,
    breakdown: entry.breakdown ?? {
      ai: 0,
      data: 0,
      revenue: 0,
      audience: 0,
      problem: 0,
      distribution: 0,
      specificity: 0
    },
    reportSummary: entry.reportSummary ?? entry.summary,
    reportType: entry.reportType ?? "validation"
  }));
}
