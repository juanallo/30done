import { useState, useEffect } from "react";
import { Challenge, ActiveChallenge, CompletionRecord, StoredChallengeData } from "@/lib/types";
import { getChallengeById } from "@/lib/data";

export function useChallenge() {
  const [storedChallenges, setStoredChallenges] = useState<StoredChallengeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const storedChallengesData = localStorage.getItem("activeChallenges");
    if (storedChallengesData) {
      try {
        const parsedData = JSON.parse(storedChallengesData);
        setStoredChallenges(parsedData);
      } catch (error) {
        console.error("Error parsing stored challenges:", error);
        setStoredChallenges([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Helper function to convert stored data to ActiveChallenge
  const getActiveChallenge = (challengeId: string): ActiveChallenge | undefined => {
    const storedChallenge = storedChallenges.find(sc => sc.challengeId === challengeId);
    if (!storedChallenge) return undefined;

    const challenge = getChallengeById(challengeId);
    if (!challenge) return undefined;

    return {
      challenge,
      currentDay: storedChallenge.currentDay,
      completedDays: storedChallenge.completedDays,
      completionRecords: storedChallenge.completionRecords,
      streak: storedChallenge.streak,
      startDate: storedChallenge.startDate,
    };
  };

  // Get all active challenges with full challenge data
  const getActiveChallenges = (): ActiveChallenge[] => {
    return storedChallenges
      .map(stored => getActiveChallenge(stored.challengeId))
      .filter((challenge): challenge is ActiveChallenge => challenge !== undefined);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const hasCompletedToday = (challengeId: string) => {
    const today = getTodayDate();
    const storedChallenge = storedChallenges.find(sc => sc.challengeId === challengeId);
    if (!storedChallenge) return false;
    return storedChallenge.completionRecords.some(record => record.date === today);
  };

  const markDayComplete = (challengeId: string, day: number) => {
    const today = getTodayDate();
    
    setStoredChallenges(prevStoredChallenges => {
      const challengeIndex = prevStoredChallenges.findIndex(sc => sc.challengeId === challengeId);
      if (challengeIndex === -1) return prevStoredChallenges;

      const storedChallenge = prevStoredChallenges[challengeIndex];
      
      // Check if already completed today for this challenge
      if (hasCompletedToday(challengeId)) {
        console.log("Already completed a day today for this challenge");
        return prevStoredChallenges;
      }

      // Check if this specific day is already completed
      if (storedChallenge.completedDays.includes(day)) {
        console.log("This day is already completed");
        return prevStoredChallenges;
      }

      const newCompleted = [...storedChallenge.completedDays, day].sort((a, b) => a - b);
      const newRecord: CompletionRecord = { day, date: today };
      const newRecords = [...storedChallenge.completionRecords, newRecord];

      // Calculate streak
      let currentStreak = 0;
      for (let i = day; i >= 1; i--) {
        if (newCompleted.includes(i)) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Update current day - should be the next consecutive day they need to complete
      const challenge = getChallengeById(challengeId);
      let nextDay = storedChallenge.currentDay; // Keep current day by default
      
      if (challenge) {
        // Find the next day they need to complete (first day not completed)
        for (let i = 1; i <= challenge.duration; i++) {
          if (!newCompleted.includes(i)) {
            nextDay = i;
            break;
          }
        }
        // If all days are completed, set to the last day + 1 or duration
        if (newCompleted.length === challenge.duration) {
          nextDay = challenge.duration;
        }
      }

      const updatedStoredChallenge: StoredChallengeData = {
        ...storedChallenge,
        currentDay: nextDay,
        completedDays: newCompleted,
        completionRecords: newRecords,
        streak: currentStreak,
      };

      const newStoredChallenges = [...prevStoredChallenges];
      newStoredChallenges[challengeIndex] = updatedStoredChallenge;
      
      // Save to localStorage
      localStorage.setItem("activeChallenges", JSON.stringify(newStoredChallenges));
      
      return newStoredChallenges;
    });
  };

  const startChallenge = (challenge: Challenge) => {
    const today = getTodayDate();
    
    // Check if challenge is already active
    const isAlreadyActive = storedChallenges.some(sc => sc.challengeId === challenge.id);
    if (isAlreadyActive) {
      console.log("Challenge is already active");
      return;
    }

    const newStoredChallenge: StoredChallengeData = {
      challengeId: challenge.id,
      currentDay: 1,
      completedDays: [],
      completionRecords: [],
      streak: 0,
      startDate: today,
    };

    const newStoredChallenges = [...storedChallenges, newStoredChallenge];
    setStoredChallenges(newStoredChallenges);
    localStorage.setItem("activeChallenges", JSON.stringify(newStoredChallenges));
  };

  const resetChallenge = (challengeId: string) => {
    setStoredChallenges(prevStoredChallenges => {
      const challengeIndex = prevStoredChallenges.findIndex(sc => sc.challengeId === challengeId);
      if (challengeIndex === -1) return prevStoredChallenges;

      const storedChallenge = prevStoredChallenges[challengeIndex];
      const today = getTodayDate();

      const resetStoredChallenge: StoredChallengeData = {
        ...storedChallenge,
        currentDay: 1,
        completedDays: [],
        completionRecords: [],
        streak: 0,
        startDate: today,
      };

      const newStoredChallenges = [...prevStoredChallenges];
      newStoredChallenges[challengeIndex] = resetStoredChallenge;
      
      localStorage.setItem("activeChallenges", JSON.stringify(newStoredChallenges));
      return newStoredChallenges;
    });
  };

  const removeChallenge = (challengeId: string) => {
    setStoredChallenges(prevStoredChallenges => {
      const newStoredChallenges = prevStoredChallenges.filter(sc => sc.challengeId !== challengeId);
      localStorage.setItem("activeChallenges", JSON.stringify(newStoredChallenges));
      return newStoredChallenges;
    });
  };

  const getChallengeProgress = (challengeId: string) => {
    const storedChallenge = storedChallenges.find(sc => sc.challengeId === challengeId);
    if (!storedChallenge) return 0;
    
    const challenge = getChallengeById(challengeId);
    if (!challenge) return 0;
    
    return (storedChallenge.completedDays.length / challenge.duration) * 100;
  };

  // For backward compatibility - returns the first active challenge
  const activeChallenges = getActiveChallenges();
  const selectedChallenge = activeChallenges.length > 0 ? activeChallenges[0].challenge : null;
  const currentDay = activeChallenges.length > 0 ? activeChallenges[0].currentDay : 1;
  const completedDays = activeChallenges.length > 0 ? activeChallenges[0].completedDays : [];
  const streak = activeChallenges.length > 0 ? activeChallenges[0].streak : 0;
  const progress = selectedChallenge ? getChallengeProgress(selectedChallenge.id) : 0;

  return {
    // New multi-challenge methods
    activeChallenges,
    getActiveChallenge,
    getChallengeProgress,
    markDayComplete,
    startChallenge,
    resetChallenge,
    removeChallenge,
    hasCompletedToday,
    isLoading,
    // Legacy single-challenge properties (for backward compatibility)
    selectedChallenge,
    currentDay,
    completedDays,
    streak,
    progress,
  };
} 