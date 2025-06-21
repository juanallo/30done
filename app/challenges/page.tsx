"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, RotateCcw, Trash2 } from "lucide-react";
import { challenges } from "@/lib/data";
import { useChallenge } from "@/hooks/useChallenge";

export default function ChallengesPage() {
  const router = useRouter();
  const { 
    activeChallenges, 
    getChallengeProgress, 
    startChallenge, 
    resetChallenge, 
    removeChallenge,
    isLoading
  } = useChallenge();

  const handleStartChallenge = (challenge: typeof challenges[0]) => {
    startChallenge(challenge);
    router.push("/dashboard");
  };

  const handleContinueChallenge = (challengeId: number) => {
    router.push(`/workout/${challengeId}`);
  };

  const handleResetChallenge = (challengeId: number) => {
    resetChallenge(challengeId);
  };

  const handleRemoveChallenge = (challengeId: number) => {
    removeChallenge(challengeId);
  };

  // Filter out active challenges from the available list
  const availableChallenges = challenges.filter(
    challenge => !activeChallenges.some(ac => ac.challenge.id === challenge.id)
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="mb-6">
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6 pt-4">
          <button
            className="btn btn-ghost btn-square"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Challenges</h1>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Active Challenges Section */}
            {activeChallenges.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-primary">
                  Active Challenges ({activeChallenges.length})
                </h2>
                <div className="space-y-4">
                  {activeChallenges.map((activeChallenge) => {
                    const progress = getChallengeProgress(activeChallenge.challenge.id);
                    return (
                      <Card key={activeChallenge.challenge.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="font-bold text-lg mb-1">
                                  {activeChallenge.challenge.title}
                                </h3>
                                <Badge
                                  variant={
                                    activeChallenge.challenge.difficulty === "Beginner"
                                      ? "secondary"
                                      : activeChallenge.challenge.difficulty === "Intermediate"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="ml-2 shrink-0"
                                >
                                  {activeChallenge.challenge.difficulty}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">
                                {activeChallenge.challenge.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Day {activeChallenge.currentDay} of {activeChallenge.challenge.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{activeChallenge.challenge.estimatedTime}</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleContinueChallenge(activeChallenge.challenge.id)}
                              className="btn btn-primary flex-1"
                            >
                              Continue Challenge
                            </button>
                            <button
                              onClick={() => handleResetChallenge(activeChallenge.challenge.id)}
                              className="btn btn-ghost btn-square"
                              title="Reset Challenge"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveChallenge(activeChallenge.challenge.id)}
                              className="btn btn-ghost btn-square text-red-500"
                              title="Remove Challenge"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Challenges Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                {activeChallenges.length > 0 ? "Other Challenges" : "Available Challenges"}
              </h2>
              <div className="space-y-4">
                {availableChallenges.map((challenge) => (
                  <Card key={challenge.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-lg mb-1">
                              {challenge.title}
                            </h3>
                            <Badge
                              variant={
                                challenge.difficulty === "Beginner"
                                  ? "secondary"
                                  : challenge.difficulty === "Intermediate"
                                  ? "default"
                                  : "destructive"
                              }
                              className="ml-2 shrink-0"
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {challenge.description}
                          </p>
                        </div>
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

                      <button
                        onClick={() => handleStartChallenge(challenge)}
                        className="btn btn-primary w-full"
                      >
                        Start Challenge
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 