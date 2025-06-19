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
} from "lucide-react";
import { useChallenge } from "@/hooks/use-challenge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedChallenge, currentDay, completedDays, streak, progress, hasCompletedToday } = useChallenge();

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
            <p className="text-gray-600">Welcome back! 👋</p>
            <h1 className="text-2xl font-bold">{selectedChallenge.title}</h1>
          </div>

          {/* Progress Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Progress</span>
                <span className="text-sm text-gray-600">
                  {completedDays.length}/{selectedChallenge.duration} days
                </span>
              </div>
              <Progress value={progress} className="mb-2" />
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{streak} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Workout */}
        <div className="p-4">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Today's Workout</h3>
                <Badge>Day {currentDay}</Badge>
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

              {selectedChallenge.exercises[0] && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">
                    {selectedChallenge.exercises[0].name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {selectedChallenge.exercises[0].details}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {selectedChallenge.exercises[0].duration} minutes
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/workout")}
                  disabled={hasCompletedToday()}
                  className={cn(
                    "btn flex-1",
                    hasCompletedToday() 
                      ? "btn-disabled opacity-50 cursor-not-allowed" 
                      : "btn-primary"
                  )}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {hasCompletedToday() ? "Completed Today" : "Start Workout"}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => router.push("/progress")}
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">View Progress</p>
                <button
                  className="btn btn-ghost btn-sm mt-2"
                  onClick={() => router.push("/progress")}
                >
                  Open
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">Reminders</p>
                <button className="btn btn-ghost btn-sm mt-2">
                  Set Time
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 