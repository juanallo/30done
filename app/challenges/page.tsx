"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, RotateCcw } from "lucide-react";
import { challenges } from "@/lib/data";
import { useChallenge } from "@/hooks/use-challenge";

export default function ChallengesPage() {
  const router = useRouter();
  const { selectedChallenge, currentDay, completedDays, progress, startChallenge } = useChallenge();

  const handleStartChallenge = (challenge: typeof challenges[0]) => {
    startChallenge(challenge);
    router.push("/dashboard");
  };

  const handleContinueChallenge = () => {
    router.push("/dashboard");
  };

  const handleResetChallenge = () => {
    if (selectedChallenge) {
      startChallenge(selectedChallenge);
    }
  };

  // Filter out the current challenge from the list
  const availableChallenges = challenges.filter(
    challenge => !selectedChallenge || challenge.id !== selectedChallenge.id
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

        <div className="space-y-4">
          {/* Current Challenge Section */}
          {selectedChallenge && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-primary">Current Challenge</h2>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg mb-1">
                          {selectedChallenge.title}
                        </h3>
                        <Badge
                          variant={
                            selectedChallenge.difficulty === "Beginner"
                              ? "secondary"
                              : selectedChallenge.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                          }
                          className="ml-2 shrink-0"
                        >
                          {selectedChallenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {selectedChallenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Day {currentDay} of {selectedChallenge.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedChallenge.estimatedTime}</span>
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
                      onClick={handleContinueChallenge}
                      className="btn btn-primary flex-1"
                    >
                      Continue Challenge
                    </button>
                    <button
                      onClick={handleResetChallenge}
                      className="btn btn-ghost btn-square"
                      title="Reset Challenge"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Available Challenges Section */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {selectedChallenge ? "Other Challenges" : "Available Challenges"}
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
      </div>
    </div>
  );
} 