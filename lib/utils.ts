import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts initials from a challenge title
 * @param title - The challenge title
 * @returns The initials (e.g., "C30DC" for "Cardio 30 Day Challenge")
 */
export function getChallengeInitials(title: string): string {
  // Split by spaces and filter out common words like "Day", "Challenge"
  const words = title.split(' ').filter(word => 
    !['day', 'challenge', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase())
  );
  
  // Extract first letter of each word and numbers
  const initials = words.map(word => {
    // If the word is a number, include it
    if (/^\d+$/.test(word)) {
      return word;
    }
    // Otherwise, take the first letter
    return word.charAt(0).toUpperCase();
  }).join('');
  
  return initials || title.substring(0, 3).toUpperCase();
}
