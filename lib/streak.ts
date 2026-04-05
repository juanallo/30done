import { subDays } from "date-fns";
import type { CompletionRecord } from "@/lib/types";

/**
 * Calendar streak: consecutive local calendar days with a completion,
 * counting backward from the latest completion date (not "today").
 */
export function computeCalendarStreakFromDates(isoDates: string[]): number {
  if (isoDates.length === 0) return 0;

  const unique = [...new Set(isoDates)];
  unique.sort();
  const latest = unique[unique.length - 1];
  const set = new Set(unique);

  let streak = 0;
  let cursor = parseCalendarDate(latest);

  while (set.has(formatCalendarDate(cursor))) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

export function computeCalendarStreakFromRecords(
  records: CompletionRecord[]
): number {
  return computeCalendarStreakFromDates(records.map((r) => r.date));
}

function parseCalendarDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatCalendarDate(d: Date): string {
  const y = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${month}-${day}`;
}
