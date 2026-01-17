/**
 * Confidence Score Service
 * 
 * Calculates a confidence score (0-100) for extracted resume data.
 * Scores are based on data presence and match frequency.
 */

/**
 * Calculate confidence score for extracted data
 * 
 * Procedure:
 * 1. Return 0 if value is empty, null, or empty array (no data)
 * 2. Start with base score of 60
 * 3. Add bonus points for matches (10 points per match, max 30 points)
 * 4. Cap final score at 100
 * 
 * @param {string|Array} value - The extracted value to score
 * @param {number} matches - Number of pattern matches found (default 0)
 * @returns {number} Confidence score from 0 to 100
 */
const confidence = (value, matches = 0) => {
  // Return 0 if no value provided or value is empty array
  if (!value || (Array.isArray(value) && value.length === 0)) return 0;
  
  // Start with base confidence score
  let score = 60;
  
  // Add bonus for each match found, capped at 30 points
  score += Math.min(matches * 10, 30);
  
  // Ensure score doesn't exceed 100
  return Math.min(score, 100);
};

// Export confidence function as default export
export default confidence;
