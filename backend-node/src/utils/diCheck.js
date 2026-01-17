// Simple list of non-inclusive words/phrases
const nonInclusiveWords = [
  "guys",
  "manpower",
  "he/she",
  "chairman",
  "crazy",
  "ninja",
  "rockstar"
];

export function checkDI(text) {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const issues = [];

  for (const word of nonInclusiveWords) {
    if (lowerText.includes(word.toLowerCase())) {
      issues.push(`Avoid using "${word}"`);
    }
  }

  return issues;
}