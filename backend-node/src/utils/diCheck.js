/**
 * Diversity & Inclusion (D&I) Check Utility
 * 
 * Detects non-inclusive language in job descriptions
 * and flags words/phrases that should be avoided.
 */

// List of non-inclusive words and phrases commonly found in job postings
const nonInclusiveWords = [
  "guys",           // Gender-specific, excludes non-male identities
  "manpower",       // Gender-biased term
  "he/she",         // Binary gender assumption
  "chairman",       // Gender-specific role title
  "crazy",          // Ableist language
  "ninja",          // Unrealistic expectations
  "rockstar"        // Unrealistic expectations
];

/**
 * Check text for non-inclusive language
 * 
 * Procedure:
 * 1. Return empty array if text is empty
 * 2. Convert text to lowercase for case-insensitive matching
 * 3. Search for each non-inclusive word in the text
 * 4. Add issue message to array for each match found
 * 5. Return array of issues
 * 
 * @param {string} text - The text to check (job description)
 * @returns {Array<string>} Array of D&I issues found
 */
export function checkDI(text) {
  // Return empty array if no text provided
  if (!text) return [];

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Array to store found issues
  const issues = [];

  // Check each non-inclusive word in the text
  for (const word of nonInclusiveWords) {
    if (lowerText.includes(word.toLowerCase())) {
      // Add issue message when non-inclusive word is found
      issues.push(`Avoid using "${word}"`);
    }
  }

  // Return array of all issues found
  return issues;
}