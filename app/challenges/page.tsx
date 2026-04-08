"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useChallenge } from "@/hooks/useChallenge";
import { challenges } from "@/lib/data";
import { NavigationHeader } from "@/components/navigation-header";
import { Button } from "@/components/ui/button";

export default function ChallengesPage() {
  const router = useRouter();
  const {
    activeChallenges,
    startChallenge,
    resetChallenge,
    removeChallenge,
    getChallengeProgress,
    isLoading,
  } = useChallenge();

  const handleStartChallenge = (challenge: (typeof challenges)[0]) => {
    startChallenge(challenge);
    router.push("/dashboard");
  };

  const handleContinueChallenge = (challengeId: string) => {
    router.push(`/workout/${challengeId}`);
  };

  const handleResetChallenge = (challengeId: string) => {
    resetChallenge(challengeId);
  };

  const handleRemoveChallenge = (challengeId: string) => {
    removeChallenge(challengeId);
  };

  // Filter out challenges that are already active
  const availableChallenges = challenges.filter(
    (challenge) =>
      !activeChallenges.some(
        (activeChallenge) => activeChallenge.challenge.id === challenge.id
      )
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
              </div>
              <Skeleton className="h-6 w-20 ml-2" />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <NavigationHeader title="Choose Your Challenge" backHref="/" showBack={activeChallenges.length === 0} />

        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              {/* Active Challenges Section */}
              {activeChallenges.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active Challenges ({activeChallenges.length})
                  </h2>
                  <div className="space-y-4">
                    {activeChallenges.map((activeChallenge) => {
                      const progress = getChallengeProgress(
                        activeChallenge.challenge.id
                      );
                      return (
                        <Card
                          key={activeChallenge.challenge.id}
                          className="overflow-hidden"
                        >
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-bold text-lg mb-1 text-gray-800">
                                    {activeChallenge.challenge.title}
                                  </h3>
                                  <Badge
                                    variant={
                                      activeChallenge.challenge.difficulty ===
                                      "Beginner"
                                        ? "outline"
                                        : activeChallenge.challenge
                                            .difficulty === "Intermediate"
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
                                <span>
                                  Day {activeChallenge.currentDay} of{" "}
                                  {activeChallenge.challenge.duration}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {activeChallenge.challenge.estimatedTime}
                                </span>
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
                                  className="bg-primary h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="btn btn-primary flex-1"
                                onClick={() =>
                                  handleContinueChallenge(
                                    activeChallenge.challenge.id
                                  )
                                }
                              >
                                Continue Challenge
                              </button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleResetChallenge(
                                    activeChallenge.challenge.id
                                  )
                                }
                                title="Reset Challenge"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() =>
                                  handleRemoveChallenge(
                                    activeChallenge.challenge.id
                                  )
                                }
                                title="Remove Challenge"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  {activeChallenges.length > 0
                    ? "Other Challenges"
                    : "Available Challenges"}
                </h2>
                <div className="space-y-4">
                  {availableChallenges.map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-lg mb-1 text-gray-800">
                                {challenge.title}
                              </h3>
                              <Badge
                                variant={
                                  challenge.difficulty === "Beginner"
                                    ? "outline"
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

                        <div className="flex gap-2 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              router.push(`/challenges/${challenge.id}`)
                            }
                          >
                            View Details
                          </Button>
                          <button
                            type="button"
                            className="btn btn-primary flex-1"
                            onClick={() => handleStartChallenge(challenge)}
                          >
                            Start Challenge
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
