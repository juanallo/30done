import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkoutCompletionActions } from "@/components/workout-completion-actions";

describe("WorkoutCompletionActions", () => {
  it("does not show skip for today", () => {
    render(<WorkoutCompletionActions onMarkComplete={() => {}} />);
    expect(
      screen.queryByRole("button", { name: /skip for today/i })
    ).not.toBeInTheDocument();
  });

  it("shows mark as complete", () => {
    render(<WorkoutCompletionActions onMarkComplete={() => {}} />);
    expect(
      screen.getByRole("button", { name: /mark as complete/i })
    ).toBeInTheDocument();
  });
});
