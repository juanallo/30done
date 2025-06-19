"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChallenge } from "@/hooks/use-challenge";

export default function ProgressPage() {
  const router = useRouter();
  const { selectedChallenge, currentDay, completedDays, streak, progress, markDayComplete, hasCompletedToday } = useChallenge();

  const getDayStatus = (day: number) => {
    if (completedDays.includes(day)) return "completed";
    if (day === currentDay) return "current";
    if (day < currentDay) return "missed";
    return "upcoming";
  };

  const canMarkComplete = (day: number) => {
    // Can only mark current day or missed days as complete
    if (day > currentDay) return false;
    // Can't mark if already completed
    if (completedDays.includes(day)) return false;
    // Can't mark if already completed something today
    if (hasCompletedToday()) return false;
    return true;
  };

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
            <h1 className="text-xl font-bold">Progress Tracker</h1>
            <div></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {completedDays.length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {streak}
              </div>
              <div className="text-sm text-gray-600">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(progress)}%
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>

          {/* Today's completion status */}
          {hasCompletedToday() && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Today's workout completed!</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Don't Break the Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from(
                  { length: selectedChallenge.duration },
                  (_, i) => i + 1
                ).map((day) => {
                  const status = getDayStatus(day);
                  const canComplete = canMarkComplete(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (canComplete) {
                          markDayComplete(day);
                        }
                      }}
                      disabled={!canComplete}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                        status === "completed" && "bg-green-500 text-white",
                        status === "current" &&
                          "bg-purple-500 text-white ring-2 ring-purple-300",
                        status === "missed" && "bg-red-100 text-red-600",
                        status === "upcoming" && "bg-gray-100 text-gray-400",
                        !canComplete && status !== "completed" && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {status === "completed" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        day
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 gap-2 text-sm grid grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Current Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
                  <span>Upcoming</span>
                </div>
              </div>

              {/* Info about daily limit */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">You can only complete one day per calendar day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 