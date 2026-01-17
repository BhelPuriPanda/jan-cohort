/**
 * Text Readability Utility
 * 
 * Calculates the Flesch Reading Ease score to measure how easy
 * a text is to read and understand.
 */

/**
 * Count syllables in a word
 * 
 * Procedure:
 * 1. Convert word to lowercase
 * 2. Return 1 syllable for words 3 characters or less
 * 3. Count vowel groups (a,e,i,o,u,y) in the word
 * 4. Return syllable count
 * 
 * @param {string} word - The word to count syllables for
 * @returns {number} Estimated syllable count
 */
function countSyllables(word) {
  // Convert to lowercase for consistent matching
  word = word.toLowerCase();
  
  // Short words (3 chars or less) typically have 1 syllable
  if (word.length <= 3) return 1;

  // Match vowel groups: 1-2 consecutive vowels (y is included)
  const matches = word.match(/[aeiouy]{1,2}/g);
  
  // Return count of vowel groups or 1 if no matches
  return matches ? matches.length : 1;
}

/**
 * Calculate Flesch Reading Ease score
 * 
 * Flesch Reading Ease formula: 206.835 - 1.015 * ASL - 84.6 * ASW
 * Score interpretation:
 * - 90-100: Very easy (5th grade)
 * - 60-70: Standard (8th-9th grade)
 * - 0-30: Very difficult (college graduate)
 * 
 * Procedure:
 * 1. Split text into sentences
 * 2. Split text into words
 * 3. Count total syllables in all words
 * 4. Calculate average sentence length (ASL)
 * 5. Calculate average syllables per word (ASW)
 * 6. Apply Flesch formula and round result
 * 
 * @param {string} text - The text to analyze
 * @returns {number} Flesch Reading Ease score (0-100+)
 */
export function fleschReadingEase(text) {
  // Split text into sentences (remove empty ones)
  const sentences = text.split(/[.!?]/).filter(Boolean);
  
  // Split text into words (remove empty ones)
  const words = text.split(/\s+/).filter(Boolean);
  
  // Count total syllables: sum syllables of all words
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  // Calculate average sentence length (words per sentence)
  const ASL = words.length / sentences.length;
  
  // Calculate average syllables per word
  const ASW = syllables / words.length;

  // Apply Flesch Reading Ease formula
  const score = 206.835 - 1.015 * ASL - 84.6 * ASW;
  
  // Round score for simplicity and return
  return Math.round(score);
}
