import { describe, expect, it } from "vitest";
import {
  computeCalendarStreakFromDates,
  computeCalendarStreakFromRecords,
} from "@/lib/streak";

describe("computeCalendarStreakFromDates", () => {
  it("returns 0 for no completion dates", () => {
    expect(computeCalendarStreakFromDates([])).toBe(0);
  });

  it("returns 1 for a single completion day", () => {
    expect(computeCalendarStreakFromDates(["2025-06-10"])).toBe(1);
  });

  it("counts consecutive calendar days ending at the latest completion", () => {
    expect(
      computeCalendarStreakFromDates(["2025-06-09", "2025-06-10"])
    ).toBe(2);
  });

  it("resets to 1 when there is a gap before the latest completion", () => {
    expect(
      computeCalendarStreakFromDates(["2025-06-07", "2025-06-10"])
    ).toBe(1);
  });

  it("dedupes multiple completions on the same calendar day", () => {
    expect(
      computeCalendarStreakFromDates([
        "2025-06-10",
        "2025-06-10",
        "2025-06-09",
      ])
    ).toBe(2);
  });

  it("handles month boundaries", () => {
    expect(
      computeCalendarStreakFromDates(["2025-05-31", "2025-06-01"])
    ).toBe(2);
  });
});

describe("computeCalendarStreakFromRecords", () => {
  it("uses completion record dates", () => {
    expect(
      computeCalendarStreakFromRecords([
        { day: 1, date: "2025-06-09" },
        { day: 2, date: "2025-06-10" },
      ])
    ).toBe(2);
  });
});
