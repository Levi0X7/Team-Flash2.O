// This file is used for client-side utilities related to word manipulation

/**
 * Scramble a word by randomly rearranging its letters
 * @param word The word to scramble
 * @returns An array of scrambled letters
 */
export function scrambleWord(word: string): string[] {
  const letters = word.split('');
  
  // Fisher-Yates shuffle algorithm
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  
  // Make sure the scrambled word is not the same as the original
  if (letters.join('') === word) {
    return scrambleWord(word); // Try again recursively
  }
  
  return letters;
}

/**
 * Calculate score based on word length and time remaining
 * @param wordLength Length of the solved word
 * @param timeRemaining Seconds remaining on the timer
 * @param level Current difficulty level
 * @returns The calculated score
 */
export function calculateScore(wordLength: number, timeRemaining: number, level: number): number {
  const baseScore = wordLength * 5;
  const timeBonus = Math.floor(timeRemaining / 2);
  const levelMultiplier = 1 + (level * 0.25); // Higher levels give more points
  
  return Math.floor((baseScore + timeBonus) * levelMultiplier);
}

/**
 * Calculate time limit based on level
 * @param level Current game level
 * @returns Time limit in seconds
 */
export function getTimeLimitForLevel(level: number): number {
  const baseTime = 60;
  const reductionPerLevel = 5;
  const minTime = 30;
  
  return Math.max(minTime, baseTime - ((level - 1) * reductionPerLevel));
}
