import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActiveChallenge } from "@/lib/types";
import HomePage from "./page";

const { mockReplace, useChallengeMock } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  useChallengeMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img">) => <img {...props} alt={props.alt ?? ""} />,
}));

vi.mock("@/hooks/useChallenge", () => ({
  useChallenge: () => useChallengeMock(),
}));

const minimalChallenge: ActiveChallenge["challenge"] = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  title: "Test Challenge",
  duration: 30,
  description: "desc",
  estimatedTime: "10 min/day",
  difficulty: "Beginner",
  exercises: [],
};

const oneActiveChallenge: ActiveChallenge = {
  challenge: minimalChallenge,
  currentDay: 1,
  completedDays: [],
  completionRecords: [],
  streak: 0,
  startDate: "2025-01-01",
};

const baseHookReturn = {
  getActiveChallenge: vi.fn(),
  getChallengeProgress: vi.fn(() => 0),
  markDayComplete: vi.fn(),
  startChallenge: vi.fn(),
  resetChallenge: vi.fn(),
  removeChallenge: vi.fn(),
  hasCompletedToday: vi.fn(() => false),
  selectedChallenge: null,
  currentDay: 1,
  completedDays: [] as number[],
  streak: 0,
  progress: 0,
};

describe("HomePage", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    useChallengeMock.mockReset();
  });

  it("redirects to dashboard when at least one active challenge exists", async () => {
    useChallengeMock.mockReturnValue({
      ...baseHookReturn,
      isLoading: false,
      activeChallenges: [oneActiveChallenge],
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("does not redirect while challenge data is still loading", () => {
    useChallengeMock.mockReturnValue({
      ...baseHookReturn,
      isLoading: true,
      activeChallenges: [oneActiveChallenge],
    });

    render(<HomePage />);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows landing when there are no active challenges", () => {
    useChallengeMock.mockReturnValue({
      ...baseHookReturn,
      isLoading: false,
      activeChallenges: [],
    });

    render(<HomePage />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /get started now/i })
    ).toBeInTheDocument();
  });
});
