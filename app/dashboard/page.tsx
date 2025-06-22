"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  Trophy,
  Play,
  ArrowLeft,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useChallenge } from "@/hooks/useChallenge";

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-md mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 pt-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        <div className="mb-4">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Add Challenge Button Skeleton */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Skeleton className="h-12 w-full rounded" />
          </CardContent>
        </Card>
      </div>

      {/* Challenge Cards Skeleton */}
      <div className="p-4 space-y-4">
        {Array.from({ length: 2 }, (_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full rounded-full mb-2" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>

              {/* Today's Workout */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1 rounded" />
                <Skeleton className="h-12 w-12 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const {
    activeChallenges,
    getChallengeProgress,
    hasCompletedToday,
    isLoading,
  } = useChallenge();

  // Mock achievements - in a real app, these would come from user data
  const mockAchievements = [
    { type: "first_workout" as const },
    { type: "streak" as const, value: 7 },
    { type: "milestone" as const, value: 10 },
    { type: "perfect_week" as const },
  ];

  // Show loading skeleton while data is being loaded
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (activeChallenges.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto p-6">
          <div className="w-24 h-24 gradient-animated rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 mb-6">
            Choose your first challenge and begin your fitness journey!
          </p>
          <button
            className="btn btn-primary gradient-success hover:scale-105 transition-transform shadow-lg"
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
        {/* Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center mb-4 pt-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/challenges")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Challenges
            </h1>
          </div>

          <p className="text-gray-600 text-sm px-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {activeChallenges.length} active challenge
            {activeChallenges.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Active Challenges List */}
        <div className="p-4 space-y-4">
          {activeChallenges.map((activeChallenge) => {
            const progress = getChallengeProgress(activeChallenge.challenge.id);
            const completedToday = hasCompletedToday(
              activeChallenge.challenge.id
            );
            const currentExercise = activeChallenge.challenge.exercises.find(
              (ex) => ex.day === activeChallenge.currentDay
            );

            return (
              <Card
                key={activeChallenge.challenge.id}
                className="overflow-hidden"
              >
                <CardContent className="p-4">
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {activeChallenge.challenge.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            activeChallenge.challenge.difficulty === "Beginner"
                              ? "secondary"
                              : activeChallenge.challenge.difficulty ===
                                "Intermediate"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {activeChallenge.challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-blue-700">
                          Day {activeChallenge.currentDay} of{" "}
                          {activeChallenge.challenge.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-3 bg-gray-200 " />
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Day {activeChallenge.currentDay} of{" "}
                          {activeChallenge.challenge.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{activeChallenge.challenge.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Workout with enhanced styling */}
                  {currentExercise && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Today's Workout
                        </span>
                        {completedToday && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              Completed!
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 font-medium mb-2">
                        {currentExercise.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {currentExercise.details}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/workout/${activeChallenge.challenge.id}`)
                      }
                      className="btn btn-primary flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {completedToday ? "View Workout" : "Start Workout"}
                    </button>
                    <button
                      className="btn btn-ghost btn-square"
                      onClick={() =>
                        router.push(`/progress/${activeChallenge.challenge.id}`)
                      }
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {/* Add Challenge Button */}
          <button
            onClick={() => router.push("/challenges")}
            className="btn btn-ghost w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
