"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Target,
  Flame,
  Trophy,
  Play,
  CheckCircle,
  ArrowLeft,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for challenges
const challenges = [
  {
    id: 1,
    title: "Cardio 30-Day Challenge",
    duration: 30,
    description: "High-intensity cardio workouts to boost your endurance",
    estimatedTime: "15-20 min/day",
    difficulty: "Intermediate",
    exercises: [
      {
        day: 1,
        name: "Warm-up Cardio",
        details: "50 jumping jacks, 30 high knees, 20 burpees",
        duration: 15,
      },
      {
        day: 2,
        name: "HIIT Blast",
        details: "100 high knees, 40 mountain climbers, 30 jump squats",
        duration: 18,
      },
      {
        day: 3,
        name: "Endurance Builder",
        details: "60 jumping jacks, 50 high knees, 25 burpees",
        duration: 20,
      },
      // Add more days as needed
    ],
  },
  {
    id: 2,
    title: "Core Strength Challenge",
    duration: 30,
    description: "Build a stronger core with daily targeted exercises",
    estimatedTime: "10-15 min/day",
    difficulty: "Beginner",
    exercises: [
      {
        day: 1,
        name: "Core Foundation",
        details: "30 crunches, 20 leg raises, 30-sec plank",
        duration: 12,
      },
    ],
  },
  {
    id: 3,
    title: "Full Body Transformation",
    duration: 30,
    description: "Complete body workout combining strength and cardio",
    estimatedTime: "25-30 min/day",
    difficulty: "Advanced",
    exercises: [
      {
        day: 1,
        name: "Total Body Blast",
        details: "20 push-ups, 30 squats, 15 burpees, 45-sec plank",
        duration: 25,
      },
    ],
  },
];

type Screen = "welcome" | "challenges" | "dashboard" | "workout" | "progress";

export default function FitnessApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedChallenge, setSelectedChallenge] = useState<
    (typeof challenges)[0] | null
  >(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  // Calculate progress
  const progress = selectedChallenge
    ? (completedDays.length / selectedChallenge.duration) * 100
    : 0;

  const markDayComplete = (day: number) => {
    if (!completedDays.includes(day)) {
      const newCompleted = [...completedDays, day].sort((a, b) => a - b);
      setCompletedDays(newCompleted);

      // Calculate streak
      let currentStreak = 0;
      for (let i = day; i >= 1; i--) {
        if (newCompleted.includes(i)) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900  to-slate-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Main illustration area */}
      <div className="mb-8 relative">
        {/* <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4"> */}
          <Image
            src="/logo.png"
            alt="30done Logo"
            width={240}
            height={2400}
            className="object-contain"
          />
        {/* </div> */}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Set Your Goal,
          <br />
          Crush Your Limit!
        </h1>
        <p className="text-purple-200 text-lg">
          Join thousands completing 30-day fitness challenges
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          className="btn btn-secondary w-full"
          onClick={() => setCurrentScreen("challenges")}
        >
          Get started
        </button>
        <button className="btn btn-ghost w-full">Login with Google</button>
      </div>
    </div>
  );

  const ChallengesScreen = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen("welcome")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Choose Challenge</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {challenge.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      challenge.difficulty === "Beginner"
                        ? "secondary"
                        : challenge.difficulty === "Intermediate"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{challenge.duration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{challenge.estimatedTime}</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setCurrentScreen("dashboard");
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("challenges")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-600" />
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Welcome back! 👋</p>
            <h1 className="text-2xl font-bold">{selectedChallenge?.title}</h1>
          </div>

          {/* Progress Card */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Progress</span>
                <span className="text-sm text-gray-600">
                  {completedDays.length}/{selectedChallenge?.duration} days
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

              {selectedChallenge?.exercises[0] && (
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
                <Button
                  onClick={() => setCurrentScreen("workout")}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentScreen("progress")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">View Progress</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen("progress")}
                  className="mt-2"
                >
                  Open
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">Reminders</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Set Time
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkoutScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-4 rounded-b-3xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("dashboard")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Day {currentDay} Workout</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4">
          {selectedChallenge?.exercises[0] && (
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

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      markDayComplete(currentDay);
                      setCurrentDay((prev) =>
                        Math.min(prev + 1, selectedChallenge?.duration || 30)
                      );
                      setCurrentScreen("dashboard");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentScreen("dashboard")}
                  >
                    Skip for Today
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  const ProgressScreen = () => {
    const getDayStatus = (day: number) => {
      if (completedDays.includes(day)) return "completed";
      if (day === currentDay) return "current";
      if (day < currentDay) return "missed";
      return "upcoming";
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-4 rounded-b-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4 pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentScreen("dashboard")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
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
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={index}
                      className="text-center text-sm font-medium text-gray-600 p-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from(
                    { length: selectedChallenge?.duration || 30 },
                    (_, i) => i + 1
                  ).map((day) => {
                    const status = getDayStatus(day);
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (
                            day <= currentDay &&
                            !completedDays.includes(day)
                          ) {
                            markDayComplete(day);
                          }
                        }}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          status === "completed" && "bg-green-500 text-white",
                          status === "current" &&
                            "bg-purple-500 text-white ring-2 ring-purple-300",
                          status === "missed" && "bg-red-100 text-red-600",
                          status === "upcoming" && "bg-gray-100 text-gray-400"
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

                <div className="mt-6 space-y-2 text-sm">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {currentScreen === "welcome" && <WelcomeScreen />}
      {currentScreen === "challenges" && <ChallengesScreen />}
      {currentScreen === "dashboard" && <DashboardScreen />}
      {currentScreen === "workout" && <WorkoutScreen />}
      {currentScreen === "progress" && <ProgressScreen />}
    </div>
  );
}
