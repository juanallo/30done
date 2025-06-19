import { Challenge } from "./types";

// Mock data for challenges
export const challenges: Challenge[] = [
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