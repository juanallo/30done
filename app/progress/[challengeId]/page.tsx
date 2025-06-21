"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ArrowLeft, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChallenge } from "@/hooks/useChallenge";

interface ProgressPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

// Loading skeleton component
const ProgressSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-md mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white p-4 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4 pt-4">
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-6 w-20" />
          <div className="w-10"></div>
        </div>

        <div className="mb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Progress Grid Skeleton */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Challenge Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 30 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-full" />
              ))}
            </div>

            {/* Legend Skeleton */}
            <div className="mt-4 space-y-2 text-sm grid grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            {/* Stats Skeleton */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default function ProgressPage({ params }: ProgressPageProps) {
  const router = useRouter();
  const { challengeId } = use(params);
  const { getActiveChallenge, markDayComplete, hasCompletedToday, isLoading } =
    useChallenge();

  const activeChallenge = getActiveChallenge(challengeId);

  // Show loading skeleton while data is being loaded
  if (isLoading) {
    return <ProgressSkeleton />;
  }

  // Show not found state only after loading is complete
  if (!activeChallenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Challenge not found</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getDayStatus = (day: number) => {
    if (activeChallenge.completedDays.includes(day)) return "completed";
    if (day === activeChallenge.currentDay) return "current";
    if (day < activeChallenge.currentDay) return "missed";
    return "upcoming";
  };

  const canMarkComplete = (day: number) => {
    // Can only mark current day or missed days as complete
    if (day > activeChallenge.currentDay) return false;
    // Can't mark if already completed
    if (activeChallenge.completedDays.includes(day)) return false;
    // Can't mark if already completed something today
    if (hasCompletedToday(challengeId)) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Progress</h1>
            <div></div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {activeChallenge.challenge.title}
            </h2>
            <p className="text-gray-600 text-sm">
              Day {activeChallenge.currentDay} of{" "}
              {activeChallenge.challenge.duration}
            </p>
          </div>
        </div>

        {/* Progress Grid */}
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Challenge Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {Array.from(
                  { length: activeChallenge.challenge.duration },
                  (_, i) => {
                    const day = i + 1;
                    const status = getDayStatus(day);
                    const exercise = activeChallenge.challenge.exercises.find(
                      (ex) => ex.day === day
                    );

                    return (
                      <div
                        key={day}
                        className={cn(
                          "aspect-square rounded-full border-2 flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all",
                          {
                            "bg-green-500 text-white border-green-500":
                              status === "completed",
                            "bg-blue-500 text-white border-blue-500":
                              status === "current",
                            "bg-red-100 text-red-700 border-red-300":
                              status === "missed",
                            "bg-gray-100 text-gray-500 border-gray-300":
                              status === "upcoming",
                          }
                        )}
                        onClick={() => {
                          if (canMarkComplete(day)) {
                            markDayComplete(challengeId, day);
                          }
                        }}
                        title={
                          exercise
                            ? `${exercise.name}: ${exercise.details}`
                            : `Day ${day}`
                        }
                      >
                        {status !== "completed" && (
                          <span className="text-xs">{day}</span>
                        )}
                        {status === "completed" && (
                          <CheckCircle className="h-3 w-3 mt-1" />
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 space-y-2 text-sm grid grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border"></div>
                  <span>Current Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-full"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-full"></div>
                  <span>Upcoming</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {activeChallenge.completedDays.length}
                  </div>
                  <div className="text-xs text-gray-600">Days Completed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {activeChallenge.streak}
                  </div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
