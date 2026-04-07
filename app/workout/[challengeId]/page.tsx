"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useChallenge } from "@/hooks/useChallenge";
import { getChallengeInitials } from "@/lib/utils";
import { NavigationHeader } from "@/components/navigation-header";
import { WorkoutCompletionActions } from "@/components/workout-completion-actions";
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

// Loading skeleton component
const WorkoutSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-md mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white p-1 shadow-sm">
        <div className="flex items-center justify-between mb-4 pt-4">
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-6 w-32" />
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Exercise Icon and Title */}
            <div className="text-center mb-6">
              <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Carousel Skeleton */}
        <div className="mb-6 w-full">
          <Skeleton className="w-full h-64 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const router = useRouter();
  const { challengeId } = use(params);
  const { getActiveChallenge, markDayComplete, hasCompletedToday, isLoading } =
    useChallenge();

  const activeChallenge = getActiveChallenge(challengeId);

  // Show loading skeleton while data is being loaded
  if (isLoading) {
    return <WorkoutSkeleton />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md mx-auto">
        <NavigationHeader
          title={`Day ${activeChallenge.currentDay} Workout`}
          backHref="/dashboard"
        />

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 gradient-animated rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {getChallengeInitials(activeChallenge.challenge.title)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{exercise.name}</h2>
                <p className="text-gray-600 font-medium">{exercise.details}</p>
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
              {hasCompletedToday(challengeId) && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">
                      Today's workout completed! You're on fire!
                    </span>
                  </div>
                </div>
              )}

              {!hasCompletedToday(challengeId) && (
                <WorkoutCompletionActions
                  onMarkComplete={() => {
                    markDayComplete(challengeId, activeChallenge.currentDay);
                    router.push("/dashboard");
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Exercises Carousel */}
          {activeChallenge.challenge.images &&
            activeChallenge.challenge.images.length > 0 && (
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
                          <CardContent className="flex flex-col gap-3 p-4">
                            <span className="font-semibold text-center">
                              {image.title}
                            </span>
                            <div className="flex w-full items-center justify-center">
                              <Image
                                src={image.src}
                                alt={image.title}
                                width={512}
                                height={512}
                                className="h-auto max-h-64 w-auto max-w-full rounded-lg object-contain"
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
