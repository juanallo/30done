"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Settings } from "lucide-react";
import { challenges } from "@/lib/data";
import { useChallenge } from "@/hooks/use-challenge";

export default function ChallengesPage() {
  const router = useRouter();
  const { startChallenge } = useChallenge();

  const handleStartChallenge = (challenge: typeof challenges[0]) => {
    startChallenge(challenge);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            className="btn btn-ghost btn-square"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Choose Challenge</h1>
          <button className="btn btn-ghost btn-square">
            <Settings className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge) => (
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
  );
} 