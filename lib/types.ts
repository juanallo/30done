export interface Exercise {
  day: number;
  name: string;
  details: string;
  duration: number;
}

export interface Challenge {
  id: number;
  title: string;
  duration: number;
  description: string;
  estimatedTime: string;
  difficulty: string;
  exercises: Exercise[];
} 