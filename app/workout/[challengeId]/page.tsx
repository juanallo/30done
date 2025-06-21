"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useChallenge } from "@/hooks/use-challenge";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface WorkoutPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const router = useRouter();
  const { challengeId } = use(params);
  const challengeIdNum = parseInt(challengeId);
  const { getActiveChallenge, markDayComplete, hasCompletedToday } = useChallenge();

  const activeChallenge = getActiveChallenge(challengeIdNum);

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

  const exercise = activeChallenge.challenge.exercises.find(
    (exercise) => exercise.day === activeChallenge.currentDay
  );

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Exercise not found</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-1 shadow-sm">
          <div className="flex items-center justify-between mb-4 pt-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Day {activeChallenge.currentDay} Workout</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💪</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{exercise.name}</h2>
                <p className="text-gray-600">{exercise.details}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Duration</span>
                  <span className="font-semibold">
                    {exercise.duration} minutes
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Difficulty</span>
                  <Badge>{activeChallenge.challenge.difficulty}</Badge>
                </div>
              </div>

              {/* Show completion status if already completed today */}
              {hasCompletedToday(challengeIdNum) && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Today's workout already completed!
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => {
                    markDayComplete(challengeIdNum, activeChallenge.currentDay);
                    router.push("/dashboard");
                  }}
                  disabled={hasCompletedToday(challengeIdNum)}
                  className={cn(
                    "btn w-full",
                    hasCompletedToday(challengeIdNum)
                      ? "btn-disabled opacity-50 cursor-not-allowed"
                      : "btn-success"
                  )}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {hasCompletedToday(challengeIdNum)
                    ? "Already Completed Today"
                    : "Mark as Complete"}
                </button>
                <button
                  className="btn btn-outline w-full"
                  onClick={() => router.push("/dashboard")}
                >
                  Skip for Today
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Exercises Carousel */}
          {activeChallenge.challenge.images && activeChallenge.challenge.images.length > 0 && (
            <div className="mb-6 w-full">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent>
                  {activeChallenge.challenge.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card>
                        <CardContent className="flex flex-col gap-2 aspect-square items-center justify-between p-4">
                          <span className="font-semibold text-center">
                            {image.title}
                          </span>
                         <div className="flex items-center justify-center h-full w-full">
                         <Image
                            src={image.src}
                            alt={image.title}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                         </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {activeChallenge.challenge.images.length > 1 && (
                  <div className="flex items-center justify-center w-full gap-2 mt-2">
                    <CarouselPrevious className="relative top-auto left-auto transform-none" />
                    <CarouselNext className="relative top-auto right-auto transform-none" />
                  </div>
                )}
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 