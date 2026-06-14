import type { IdeaValidationHistoryEntry } from "@/lib/api/types";

export const IDEA_HISTORY_KEY = "ai-startup-copilot-idea-validation-history";

export function loadIdeaHistory(): IdeaValidationHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(IDEA_HISTORY_KEY);
    return stored ? (JSON.parse(stored) as IdeaValidationHistoryEntry[]) : [];
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
