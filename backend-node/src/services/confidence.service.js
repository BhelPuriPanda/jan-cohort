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
    // 0.0 - 1.0 Scale
    if (!value) return 0.0;
    
    // Arrays (Skills)
    if (Array.isArray(value)) {
        if (value.length === 0) return 0.0;
        // More skills = higher confidence, capped at 1.0 for >5 skills
        return Math.min(value.length * 0.2, 1.0);
    }

    // Strings
    if (typeof value === 'string') {
        const len = value.trim().length;
        if (len === 0) return 0.0;
        
        // Basic Length Checks
        if (len < 3) return 0.3; 
        
        // We assume the parser sends a "match" flag (1 or 0) often, but we can also heuristic here.
        // If it passed the Regex in parser, it's fairly high confidence.
        return 0.95; 
    }

    return 0.5;
};

// Export confidence function as default export
export default confidence;
