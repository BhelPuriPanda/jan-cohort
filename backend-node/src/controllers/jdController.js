import axios from "axios";
import { JobDescription } from "../models/JobDescription.js";
import { fleschReadingEase } from "../utils/readable.js";
import { checkDI } from "../utils/diCheck.js";
import { extractSEOKeywords } from "../utils/seoKeywords.js";


export const generateJobDescriptionAB = async (req, res) => {
  try {
    const {
      employerId,
      jobTitle,
      industry,
      experienceLevel,
      keySkills,
      companyCulture,
      specialRequirements
    } = req.body;

    if (!employerId || !jobTitle || !industry || !experienceLevel || !keySkills?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const basePrompt = `
Generate a professional, structured job description.

Job Title: ${jobTitle}
Industry: ${industry}
Experience Level: ${experienceLevel}
Key Skills: ${keySkills.join(", ")}
Company Culture: ${companyCulture}
Special Requirements: ${specialRequirements || "None"}

Structure:
- Job Title at Company
- About the Role
- Key Responsibilities
- Required Skills
- Preferred Skills
- Experience
- What We Offer
- About Company
`;

    const variations = [
      basePrompt + "\nTone: Formal and corporate.",
      basePrompt + "\nTone: Friendly startup environment.",
      basePrompt + "\nTone: Remote-first and inclusive."
    ];

    const results = [];

    for (let i = 0; i < variations.length; i++) {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: variations[i] }]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:4001",
            "X-Title": "JD Generator Hackathon"
          }
        }
      );

      const text =
        response.data.choices?.[0]?.message?.content ||
        "Generation failed.";

      const readabilityScore = fleschReadingEase(text);
      const diIssues = checkDI(text);
      const seoKeywords = extractSEOKeywords(text);

      results.push({
        version: i + 1,
        jdText: text,
        readabilityScore,
        diIssues,
        seoKeywords,
      });
    }

    const jd = await JobDescription.create({
      employerId,
      input: {
        jobTitle,
        industry,
        experienceLevel,
        keySkills,
        companyCulture,
        specialRequirements
      },
      versions: results,
      currentVersion: 1
    });

    res.status(200).json({
      jdId: jd._id,
      versions: results,
      currentVersion: 1
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "A/B JD generation failed",
      error: err.message
    });
  }
};
