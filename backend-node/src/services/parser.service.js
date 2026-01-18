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
  // 1. Extract Name
  // Heuristic: Looking for first 2-3 capitalized words on the very first few lines (naive but better than nothing)
  // We'll grab the first line(s) and check for a name-like pattern.
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let nameValue = null;
  
  // Try to find name in the first 5 lines
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
     const line = lines[i];
     // Simple check: 2-3 words, all capitalized first letters, no numbers
     if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,2}$/.test(line)) {
         nameValue = line;
         break;
     }
  }
  // Fallback to regex search in full text if not found at top
  if (!nameValue) {
      const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
      nameValue = nameMatch ? nameMatch[0] : null;
  }

  // 2. Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
  const emailValue = emailMatch ? emailMatch[0] : null;

  // 3. Extract Phone
  // Supports (123) 456-7890, 123-456-7890, 123 456 7890, +1 123 456 7890
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phoneValue = phoneMatch ? phoneMatch[0] : null;

  // 4. Extract Skills
  // Look for "Skills", "Technologies", "Technical Skills" followed by text until next section
  let skills = [];
  const skillsHeaderRegex = /(?:Skills|Technologies|Technical Skills|Competencies|Core Skills)[\s:]*/i;
  const skillsMatch = text.match(skillsHeaderRegex);
  
  if (skillsMatch) {
      const startIndex = skillsMatch.index + skillsMatch[0].length;
      // Get substring from keywords onwards
      const tempText = text.substring(startIndex);
      // Find next likely header (newline followed by capitalized words) or end of text.
      // This is tricky without strict structure. We'll take next 500 chars or until double newline.
      const rawSkills = tempText.split(/\n\s*\n/)[0]; // simplistic: take until next paragraph 
      // Split by common delimiters
      skills = rawSkills.split(/[,|•\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30);
  } else {
      // Fallback: search for common keywords
      const commonSkills = ["JavaScript", "Python", "React", "Node.js", "Java", "C++", "SQL", "AWS", "Docker", "Git", "TypeScript", "HTML", "CSS", "Agile"];
      skills = commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  }
  
  // Clean up skills array (unique values, max 15)
  skills = [...new Set(skills)].slice(0, 15);


  // Helper to extract section content
  const extractSection = (text, keywords) => {
      const pattern = new RegExp(`(?:${keywords.join('|')})[\\s:]*`, 'i');
      const match = text.match(pattern);
      if (match) {
          const startIndex = match.index + match[0].length;
          // Find the next likely header (newline followed by capitalized words) or end of text.
          // Look for double newlines or common section headers
          const nextHeaderPattern = /(?:\n\s*\n\s*[A-Z][a-z ]+)|(?:\n\s*(?:Experience|Education|Projects|Skills|Languages|Certifications|Interests))/i;
          const remainingText = text.substring(startIndex);
          const nextMatch = remainingText.match(nextHeaderPattern);
          
          let content = nextMatch ? remainingText.substring(0, nextMatch.index) : remainingText;
          // Clean up
          return content.split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(0, 10).join('\n'); // Limit to 10 lines for summary
      }
      return null;
  };

  // 5. Extract Experience
  const experienceValue = extractSection(text, ["Experience", "Work History", "Employment", "Work Experience"]);

  // 6. Extract Projects
  const projectsValue = extractSection(text, ["Projects", "Key Projects", "Project Experience"]);

  // 7. Extract Education
  const educationValue = extractSection(text, ["Education", "Academic Background", "Qualifications"]);


  return {
    name: { 
      value: nameValue,
      confidence: confidence(nameValue, nameValue ? 1 : 0)
    },
    email: { 
      value: emailValue,
      confidence: confidence(emailValue, emailValue ? 1 : 0)
    },
    phone: { 
      value: phoneValue,
      confidence: confidence(phoneValue, phoneValue ? 1 : 0)
    },
    skills: { 
      value: skills,
      confidence: confidence(skills, skills.length > 0 ? 1 : 0) 
    },
    experience: {
        value: experienceValue,
        confidence: confidence(experienceValue, experienceValue ? 1 : 0)
    },
    projects: {
        value: projectsValue,
        confidence: confidence(projectsValue, projectsValue ? 1 : 0)
    },
    education: {
        value: educationValue,
        confidence: confidence(educationValue, educationValue ? 1 : 0)
    }
  };
};

// Export parseResume function as default export
export default parseResume;
