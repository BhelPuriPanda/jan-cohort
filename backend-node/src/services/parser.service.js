/**
 * Resume Parser Service
 * 
 * Parses extracted resume text and extracts structured data
 * using regex patterns with confidence scoring.
 */

import confidence from "./confidence.service.js";

/**
 * Parse resume text into structured fields
 * 
 * Procedure:
 * 1. Extract name using pattern (First Last name format)
 * 2. Extract email using email pattern
 * 3. Extract phone using phone number pattern
 * 4. Extract skills (placeholder - returns hardcoded values)
 * 5. Calculate confidence scores for each field
 * 6. Return structured resume data with confidence metrics
 * 
 * @param {string} text - Extracted resume text to parse
 * @returns {Object} Structured resume data with fields and confidence scores
 */
const parseResume = (text) => {
  // Extract name: matches "First Last" pattern (capitalized words)
  const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  
  // Extract email: matches standard email format
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  
  // Extract phone: matches 10-13 digit phone numbers with optional + prefix
  const phoneMatch = text.match(/\+?\d{10,13}/);

  // Return parsed resume with confidence scores for each field
  return {
    name: { 
      value: nameMatch?.[0] || null,                    // Extracted name or null
      confidence: confidence(nameMatch)                 // Confidence score
    },
    email: { 
      value: emailMatch?.[0] || null,                   // Extracted email or null
      confidence: confidence(emailMatch)                // Confidence score
    },
    phone: { 
      value: phoneMatch?.[0] || null,                   // Extracted phone or null
      confidence: confidence(phoneMatch)                // Confidence score
    },
    skills: { 
      value: ["JavaScript", "React"],                   // Placeholder skills
      confidence: 80                                     // Placeholder confidence
    }
  };
};

// Export parseResume function as default export
export default parseResume;
