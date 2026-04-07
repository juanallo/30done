"use client";

import { CheckCircle } from "lucide-react";

export interface WorkoutCompletionActionsProps {
  onMarkComplete: () => void;
}

export function WorkoutCompletionActions({
  onMarkComplete,
}: WorkoutCompletionActionsProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onMarkComplete}
        className="btn w-full btn-success"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Mark as Complete
      </button>
    </div>
  );
}
