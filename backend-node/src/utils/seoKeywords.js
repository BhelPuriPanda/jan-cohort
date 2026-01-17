// utils/seoKeywords.js

// Simple approach: extract important nouns/skills for SEO
export function extractSEOKeywords(text, keySkills = []) {
  if (!text) return [];

  // Basic keyword set from skills + common keywords
  const keywords = new Set();

  // Include all provided keySkills
  keySkills.forEach(skill => keywords.add(skill));

  // Include some common backend/tech keywords from the text
  const commonWords = [
    "Node.js",
    "MongoDB",
    "REST API",
    "AWS",
    "Docker",
    "Kubernetes",
    "Python",
    "Java",
    "Cloud",
    "FinTech",
    "Remote",
    "Startup",
    "Agile"
  ];

  commonWords.forEach(word => {
    if (text.includes(word)) keywords.add(word);
  });

  return Array.from(keywords);
}
