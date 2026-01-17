// Count syllables in a word
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Compute Flesch Reading Ease
export function fleschReadingEase(text) {
  const sentences = text.split(/[.!?]/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  const ASL = words.length / sentences.length; // avg sentence length
  const ASW = syllables / words.length;        // avg syllables per word

  const score = 206.835 - 1.015 * ASL - 84.6 * ASW;
  return Math.round(score); // rounded for simplicity
}
