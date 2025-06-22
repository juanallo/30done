"use client";

import { useRouter, useParams } from "next/navigation";
import { getChallengeById, challenges } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useChallenge } from "@/hooks/useChallenge";
import { NavigationHeader } from "@/components/navigation-header";

export default function ChallengeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;
  const challenge = getChallengeById(challengeId);
  const { startChallenge } = useChallenge();

  const handleStartChallenge = () => {
    if (challenge) {
      startChallenge(challenge);
      router.push("/dashboard");
    }
  };

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">Challenge not found.</p>
        <button
          onClick={() => router.push("/challenges")}
          className="mt-4 btn btn-primary"
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <NavigationHeader
          title={challenge.title}
          backHref="/challenges"
          titleClassName="text-2xl"
        />
        <div className="p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{challenge.duration} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{challenge.estimatedTime}</span>
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
              {challenge.images && challenge.images.length > 0 && (
                <div className="flex justify-center gap-8 my-6">
                  {challenge.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <Image
                        src={image.src}
                        alt={image.title}
                        width={100}
                        height={100}
                        className="rounded-lg object-contain h-24 w-auto"
                      />
                      <p className="text-sm mt-2 font-medium">{image.title}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="btn btn-primary w-full mt-4"
                onClick={handleStartChallenge}
              >
                Start Challenge
              </button>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">30-Day Plan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {challenge.exercises.map((exercise) => (
              <Card key={exercise.day} className="rounded-lg overflow-hidden">
                <div className="p-2 bg-gray-100 text-center">
                  <p className="font-bold text-gray-700">{exercise.day}</p>
                </div>
                <div className="p-3">
                  {exercise.details.split(",").map((detail, index) => (
                    <p
                      key={index}
                      className="text-center text-sm text-gray-600"
                    >
                      {detail.trim()}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
