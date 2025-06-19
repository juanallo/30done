import { useState, useEffect } from "react";
import { Challenge } from "@/lib/types";

interface CompletionRecord {
  day: number;
  date: string; // ISO date string (YYYY-MM-DD)
}

export function useChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completionRecords, setCompletionRecords] = useState<CompletionRecord[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const challengeData = localStorage.getItem("selectedChallenge");
    const currentDayData = localStorage.getItem("currentDay");
    const completedDaysData = localStorage.getItem("completedDays");
    const completionRecordsData = localStorage.getItem("completionRecords");
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
    if (completionRecordsData) {
      setCompletionRecords(JSON.parse(completionRecordsData));
    }
    if (streakData) {
      setStreak(parseInt(streakData));
    }
  }, []);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const hasCompletedToday = () => {
    const today = getTodayDate();
    return completionRecords.some(record => record.date === today);
  };

  const markDayComplete = (day: number) => {
    const today = getTodayDate();
    
    // Check if already completed today
    if (hasCompletedToday()) {
      console.log("Already completed a day today");
      return;
    }

    // Check if this specific day is already completed
    if (completedDays.includes(day)) {
      console.log("This day is already completed");
      return;
    }

    const newCompleted = [...completedDays, day].sort((a, b) => a - b);
    const newRecord: CompletionRecord = { day, date: today };
    const newRecords = [...completionRecords, newRecord];

    setCompletedDays(newCompleted);
    setCompletionRecords(newRecords);
    
    localStorage.setItem("completedDays", JSON.stringify(newCompleted));
    localStorage.setItem("completionRecords", JSON.stringify(newRecords));

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
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentDay(1);
    setCompletedDays([]);
    setCompletionRecords([]);
    setStreak(0);
    
    localStorage.setItem("selectedChallenge", JSON.stringify(challenge));
    localStorage.setItem("currentDay", "1");
    localStorage.setItem("completedDays", JSON.stringify([]));
    localStorage.setItem("completionRecords", JSON.stringify([]));
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
    hasCompletedToday,
  };
} 