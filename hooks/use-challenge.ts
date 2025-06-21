import { useState, useEffect } from "react";
import { Challenge, ActiveChallenge, CompletionRecord } from "@/lib/types";

export function useChallenge() {
  const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const activeChallengesData = localStorage.getItem("activeChallenges");
    if (activeChallengesData) {
      setActiveChallenges(JSON.parse(activeChallengesData));
    }
  }, []);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const hasCompletedToday = (challengeId: number) => {
    const today = getTodayDate();
    const challenge = activeChallenges.find(ac => ac.challenge.id === challengeId);
    if (!challenge) return false;
    return challenge.completionRecords.some(record => record.date === today);
  };

  const markDayComplete = (challengeId: number, day: number) => {
    const today = getTodayDate();
    
    setActiveChallenges(prevChallenges => {
      const challengeIndex = prevChallenges.findIndex(ac => ac.challenge.id === challengeId);
      if (challengeIndex === -1) return prevChallenges;

      const challenge = prevChallenges[challengeIndex];
      
      // Check if already completed today for this challenge
      if (hasCompletedToday(challengeId)) {
        console.log("Already completed a day today for this challenge");
        return prevChallenges;
      }

      // Check if this specific day is already completed
      if (challenge.completedDays.includes(day)) {
        console.log("This day is already completed");
        return prevChallenges;
      }

      const newCompleted = [...challenge.completedDays, day].sort((a, b) => a - b);
      const newRecord: CompletionRecord = { day, date: today };
      const newRecords = [...challenge.completionRecords, newRecord];

      // Calculate streak
      let currentStreak = 0;
      for (let i = day; i >= 1; i--) {
        if (newCompleted.includes(i)) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Update current day
      const nextDay = Math.min(day + 1, challenge.challenge.duration);

      const updatedChallenge: ActiveChallenge = {
        ...challenge,
        currentDay: nextDay,
        completedDays: newCompleted,
        completionRecords: newRecords,
        streak: currentStreak,
      };

      const newChallenges = [...prevChallenges];
      newChallenges[challengeIndex] = updatedChallenge;
      
      // Save to localStorage
      localStorage.setItem("activeChallenges", JSON.stringify(newChallenges));
      
      return newChallenges;
    });
  };

  const startChallenge = (challenge: Challenge) => {
    const today = getTodayDate();
    
    // Check if challenge is already active
    const isAlreadyActive = activeChallenges.some(ac => ac.challenge.id === challenge.id);
    if (isAlreadyActive) {
      console.log("Challenge is already active");
      return;
    }

    const newActiveChallenge: ActiveChallenge = {
      challenge,
      currentDay: 1,
      completedDays: [],
      completionRecords: [],
      streak: 0,
      startDate: today,
    };

    const newChallenges = [...activeChallenges, newActiveChallenge];
    setActiveChallenges(newChallenges);
    localStorage.setItem("activeChallenges", JSON.stringify(newChallenges));
  };

  const resetChallenge = (challengeId: number) => {
    setActiveChallenges(prevChallenges => {
      const challengeIndex = prevChallenges.findIndex(ac => ac.challenge.id === challengeId);
      if (challengeIndex === -1) return prevChallenges;

      const challenge = prevChallenges[challengeIndex];
      const today = getTodayDate();

      const resetChallenge: ActiveChallenge = {
        ...challenge,
        currentDay: 1,
        completedDays: [],
        completionRecords: [],
        streak: 0,
        startDate: today,
      };

      const newChallenges = [...prevChallenges];
      newChallenges[challengeIndex] = resetChallenge;
      
      localStorage.setItem("activeChallenges", JSON.stringify(newChallenges));
      return newChallenges;
    });
  };

  const removeChallenge = (challengeId: number) => {
    setActiveChallenges(prevChallenges => {
      const newChallenges = prevChallenges.filter(ac => ac.challenge.id !== challengeId);
      localStorage.setItem("activeChallenges", JSON.stringify(newChallenges));
      return newChallenges;
    });
  };

  const getChallengeProgress = (challengeId: number) => {
    const challenge = activeChallenges.find(ac => ac.challenge.id === challengeId);
    if (!challenge) return 0;
    return (challenge.completedDays.length / challenge.challenge.duration) * 100;
  };

  const getActiveChallenge = (challengeId: number) => {
    return activeChallenges.find(ac => ac.challenge.id === challengeId);
  };

  // For backward compatibility - returns the first active challenge
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
    
    // Backward compatibility
    selectedChallenge,
    currentDay,
    completedDays,
    streak,
    progress,
  };
} 