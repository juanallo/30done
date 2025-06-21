export interface Exercise {
  day: number;
  name: string;
  details: string;
  duration: number;
}

export interface ChallengeImage {
  src: string;
  title: string;
}

export interface Challenge {
  id: number;
  title: string;
  duration: number;
  description: string;
  estimatedTime: string;
  difficulty: string;
  exercises: Exercise[];
  images?: ChallengeImage[];
}

export interface CompletionRecord {
  day: number;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface ActiveChallenge {
  challenge: Challenge;
  currentDay: number;
  completedDays: number[];
  completionRecords: CompletionRecord[];
  streak: number;
  startDate: string; // ISO date string when challenge was started
} 