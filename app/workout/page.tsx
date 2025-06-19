"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useChallenge } from "@/hooks/use-challenge";
import { cn } from "@/lib/utils";

export default function WorkoutPage() {
  const router = useRouter();
  const { selectedChallenge, currentDay, markDayComplete, hasCompletedToday } = useChallenge();

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No challenge selected</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/challenges")}
          >
            Choose a Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Day {currentDay} Workout</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4">
          {selectedChallenge.exercises[0] && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">💪</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedChallenge.exercises[0].name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedChallenge.exercises[0].details}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Duration</span>
                    <span className="font-semibold">
                      {selectedChallenge.exercises[0].duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Difficulty</span>
                    <Badge>{selectedChallenge.difficulty}</Badge>
                  </div>
                </div>

                {/* Show completion status if already completed today */}
                {hasCompletedToday() && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Today's workout already completed!</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      markDayComplete(currentDay);
                      router.push("/dashboard");
                    }}
                    disabled={hasCompletedToday()}
                    className={cn(
                      "btn w-full",
                      hasCompletedToday() 
                        ? "btn-disabled opacity-50 cursor-not-allowed" 
                        : "btn-success"
                    )}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {hasCompletedToday() ? "Already Completed Today" : "Mark as Complete"}
                  </button>
                  <button
                    className="btn btn-outline w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Skip for Today
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 