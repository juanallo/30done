import { useState, useEffect } from "react";
import { Challenge } from "@/lib/types";

export function useChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const challengeData = localStorage.getItem("selectedChallenge");
    const currentDayData = localStorage.getItem("currentDay");
    const completedDaysData = localStorage.getItem("completedDays");
    const streakData = localStorage.getItem("streak");

    if (challengeData) {
      setSelectedChallenge(JSON.parse(challengeData));
    }
    if (currentDayData) {
      setCurrentDay(parseInt(currentDayData));
    }
    if (completedDaysData) {
      setCompletedDays(JSON.parse(completedDaysData));
    }
    if (streakData) {
      setStreak(parseInt(streakData));
    }
  }, []);

  const markDayComplete = (day: number) => {
    if (!completedDays.includes(day)) {
      const newCompleted = [...completedDays, day].sort((a, b) => a - b);
      setCompletedDays(newCompleted);
      localStorage.setItem("completedDays", JSON.stringify(newCompleted));

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
      localStorage.setItem("streak", currentStreak.toString());

      // Update current day
      const nextDay = Math.min(day + 1, selectedChallenge?.duration || 30);
      setCurrentDay(nextDay);
      localStorage.setItem("currentDay", nextDay.toString());
    }
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentDay(1);
    setCompletedDays([]);
    setStreak(0);
    
    localStorage.setItem("selectedChallenge", JSON.stringify(challenge));
    localStorage.setItem("currentDay", "1");
    localStorage.setItem("completedDays", JSON.stringify([]));
    localStorage.setItem("streak", "0");
  };

  // Calculate progress
  const progress = selectedChallenge
    ? (completedDays.length / selectedChallenge.duration) * 100
    : 0;

  return {
    selectedChallenge,
    currentDay,
    completedDays,
    streak,
    progress,
    markDayComplete,
    startChallenge,
  };
} 