/**
 * SEO Keywords Extraction Utility
 * 
 * Extracts important keywords from job descriptions for search
 * engine optimization and job matching.
 */

/**
 * Extract SEO keywords from job description text
 * 
 * Procedure:
 * 1. Return empty array if text is empty
 * 2. Create a Set to store unique keywords
 * 3. Add all provided key skills to the Set
 * 4. Search for common tech/industry keywords in the text
 * 5. Add matched keywords to the Set
 * 6. Convert Set to array and return
 * 
 * @param {string} text - The job description text to analyze
 * @param {Array<string>} keySkills - Array of key skills to include (default: [])
 * @returns {Array<string>} Array of extracted SEO keywords
 */
export function extractSEOKeywords(text, keySkills = []) {
  // Return empty array if no text provided
  if (!text) return [];

  // Use Set to store unique keywords (prevents duplicates)
  const keywords = new Set();

  // Add all provided key skills to the keyword set
  keySkills.forEach(skill => keywords.add(skill));

  // List of common backend, cloud, and tech keywords to search for
  const commonWords = [
    "Node.js",       // JavaScript runtime
    "MongoDB",       // NoSQL database
    "REST API",      // API architecture style
    "AWS",           // Cloud platform
    "Docker",        // Containerization
    "Kubernetes",    // Orchestration
    "Python",        // Programming language
    "Java",          // Programming language
    "Cloud",         // Cloud computing
    "FinTech",       // Financial technology
    "Remote",        // Work location
    "Startup",       // Company type
    "Agile"          // Development methodology
  ];

  // Search for each common keyword in the text
  commonWords.forEach(word => {
    if (text.includes(word)) {
      // Add found keyword to the Set
      keywords.add(word);
    }
  });

  // Convert Set to array and return unique keywords
  return Array.from(keywords);
}
