"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Target,
  Flame,
  Trophy,
  Play,
  ArrowLeft,
  Bell,
  CheckCircle,
  Plus,
} from "lucide-react";
import { useChallenge } from "@/hooks/use-challenge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { 
    activeChallenges, 
    getChallengeProgress, 
    hasCompletedToday 
  } = useChallenge();

  if (activeChallenges.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No active challenges</p>
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
        {/* Header */}
        <div className="bg-white p-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/challenges")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-600" />
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-bold">My Challenges</h1>
            <p className="text-gray-600 text-sm">
              {activeChallenges.length} active challenge{activeChallenges.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Add Challenge Button */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <button
                onClick={() => router.push("/challenges")}
                className="btn btn-outline w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Challenge
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Active Challenges List */}
        <div className="p-4 space-y-4">
          {activeChallenges.map((activeChallenge) => {
            const progress = getChallengeProgress(activeChallenge.challenge.id);
            const completedToday = hasCompletedToday(activeChallenge.challenge.id);
            const currentExercise = activeChallenge.challenge.exercises.find(
              ex => ex.day === activeChallenge.currentDay
            );

            return (
              <Card key={activeChallenge.challenge.id} className="overflow-hidden">
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
                              : activeChallenge.challenge.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {activeChallenge.challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          Day {activeChallenge.currentDay} of {activeChallenge.challenge.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {activeChallenge.completedDays.length}/{activeChallenge.challenge.duration} days
                      </span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{activeChallenge.streak} day streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Workout */}
                  {currentExercise && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Today's Workout</h4>
                        {completedToday && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span className="text-xs">Completed</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {currentExercise.details}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{currentExercise.duration} minutes</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/workout/${activeChallenge.challenge.id}`)}
                      disabled={completedToday}
                      className={cn(
                        "btn flex-1",
                        completedToday 
                          ? "btn-disabled opacity-50 cursor-not-allowed" 
                          : "btn-primary"
                      )}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {completedToday ? "Completed" : "Start Workout"}
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => router.push(`/progress/${activeChallenge.challenge.id}`)}
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
} 