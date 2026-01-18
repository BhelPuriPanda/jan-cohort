/**
 * Job Description Controller
 * 
 * This module handles all operations related to job description generation, retrieval, and management.
 * It integrates with OpenRouter API to generate A/B variations and analyzes them for readability, 
 * diversity/inclusion issues, and SEO keywords.
 */

import axios from "axios";
import { JobDescription } from "../models/JobDescription.js";
import { fleschReadingEase } from "../utils/readable.js";
import { checkDI } from "../utils/diCheck.js";
import { extractSEOKeywords } from "../utils/seoKeywords.js";
import fs from 'fs';
import path from 'path';

const logToFile = (message) => {
    const logPath = path.join(process.cwd(), 'debug_jd.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
};


/**
 * GENERATE JOB DESCRIPTION A/B TEST VERSIONS
 * 
 * Generates three different variations of a job description with different tones
 * and analyzes each for readability, diversity/inclusion, and SEO keywords.
 * 
 * Procedure:
 * 1. Validate required input fields from request body
 * 2. Build base job description prompt with provided information
 * 3. Create three variations with different tones (formal, startup-friendly, remote-first)
 * 4. Call OpenRouter API with GPT-4o-mini for each variation
 * 5. Analyze each generated JD for readability score, D&I issues, and SEO keywords
 * 6. Save all versions to database with metadata
 * 7. Return all versions with version 1 as current active version
 * 
 * @async
 * @param {Object} req - Express request with employerId, jobTitle, industry, experienceLevel, keySkills, companyCulture, specialRequirements
 * @param {Object} res - Express response object
 * @returns {Object} JSON with jdId, all versions, and current version (1)
 */
export const generateJobDescriptionAB = async (req, res) => {
  try {
    // Extract job description parameters from request body
    const {
      employerId,
      jobTitle,
      industry,
      experienceLevel,
      keySkills,
      companyCulture,
      specialRequirements,
      location // Add location to destructuring
    } = req.body;

    logToFile(`Generate AB Hit. Employer: ${employerId}, Job: ${jobTitle}`);
    console.log("Generate AB Controller Hit!");

    // Validate that all required fields are provided
    if (!employerId || !jobTitle || !industry || !experienceLevel || !keySkills?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build the base prompt template for job description generation
    const basePrompt = `
Generate a professional, structured job description.

Job Title: ${jobTitle}
Industry: ${industry}
Experience Level: ${experienceLevel}
Location: ${location || "Remote"}
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

    // Create three variations with different tones for A/B testing
    const variations = [
      basePrompt + "\nTone: Formal and corporate.",
      basePrompt + "\nTone: Friendly startup environment.",
      basePrompt + "\nTone: Remote-first and inclusive."
    ];

    // Array to store results from all variations
    const results = [];

    // Generate each variation using OpenRouter API
    for (let i = 0; i < variations.length; i++) {
      // Call OpenRouter API with GPT-4o-mini model

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

      console.log(`OpenRouter Response Status (${i}):`, response.status);
      logToFile(`OpenRouter Response Status (${i}): ${response.status}`);
      logToFile(`OpenRouter Response Data (${i}): ${JSON.stringify(response.data)}`);

      // Extract generated text from API response
      const text =
        response.data.choices?.[0]?.message?.content ||
        "Generation failed.";
      
      logToFile(`Generated Text Length (${i}): ${text.length}`);
      if (text === "Generation failed.") {
          logToFile(`ERROR: Generation failed for variation ${i}`);
          console.error("OpenRouter returned no content or malformed response:", JSON.stringify(response.data));
      }

      // Analyze generated job description
      // Calculate readability score (Flesch Reading Ease)
      const readabilityScore = fleschReadingEase(text);
      
      // Check for diversity and inclusion issues
      const diIssues = checkDI(text);
      
      // Extract SEO keywords for job search optimization
      const seoKeywords = extractSEOKeywords(text);

      // Store this variation's results
      results.push({
        version: i + 1,
        jdText: text,
        readabilityScore,
        diIssues,
        seoKeywords,
      });
    }

    // Save all generated versions to database
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
      currentVersion: 1  // Set first version as active by default
    });

    // Return generated versions to client
    res.status(200).json({
      jdId: jd._id,
      versions: results,
      currentVersion: 1
    });
  } catch (err) {
    // Log and return error response
    console.error(err.message);
    res.status(500).json({
      message: "A/B JD generation failed",
      error: err.message
    });
  }
};

/**
 * GET JOB DESCRIPTION
 * 
 * Retrieves a complete job description with all its versions by ID.
 * 
 * Procedure:
 * 1. Extract jdId from URL parameters
 * 2. Query database for the job description
 * 3. Return complete JD document if found, or 404 error if not
 * 
 * @async
 * @param {Object} req - Express request with jdId in params
 * @param {Object} res - Express response object
 * @returns {Object} Complete job description document from database
 */
export const getJD = async (req, res) => {
  try {
    // Extract job description ID from URL parameters
    const { jdId } = req.params;
    
    // Query database for the job description by ID
    const jd = await JobDescription.findById(jdId);
    
    // Return 404 if job description not found
    if (!jd) return res.status(404).json({ message: "JD not found" });

    // Return the complete job description document
    res.status(200).json(jd);
  } catch (err) {
    // Return error response if query fails
    res.status(500).json({ message: "Failed to fetch JD", error: err.message });
  }
};

/**
 * SWITCH JOB DESCRIPTION VERSION
 * 
 * Changes the currently active version of a job description.
 * Users can switch between different generated variations to select which one is active.
 * 
 * Procedure:
 * 1. Extract jdId from URL parameters and desired version from request body
 * 2. Query database for the job description
 * 3. Verify the requested version exists in the versions array
 * 4. Update currentVersion field to the requested version
 * 5. Save the updated job description to database
 * 6. Return confirmation with new current version
 * 
 * @async
 * @param {Object} req - Express request with jdId in params and version in body
 * @param {Object} res - Express response object
 * @returns {Object} Success message with updated currentVersion
 */
export const switchJDVersion = async (req, res) => {
  try {
    // Extract job description ID from URL parameters
    const { jdId } = req.params;
    
    // Extract desired version number from request body
    const { version } = req.body;

    // Query database for the job description
    const jd = await JobDescription.findById(jdId);
    
    // Return 404 if job description not found
    if (!jd) return res.status(404).json({ message: "JD not found" });

    // Verify the requested version exists in the versions array
    if (!jd.versions.find(v => v.version === version))
      return res.status(400).json({ message: "Version not found" });

    // Update the current active version
    jd.currentVersion = version;
    
    // Save changes to database
    await jd.save();

    // Return success response with new current version
    res.status(200).json({ message: "Version switched", currentVersion: jd.currentVersion });
  } catch (err) {
    // Return error response if operation fails
    res.status(500).json({ message: "Failed to switch version", error: err.message });
  }
};

/**
 * SAVE EDITED JOB DESCRIPTION AS NEW VERSION
 * 
 * Allows users to edit a job description and save changes as a new version.
 * This preserves all previous versions and creates an audit trail.
 * 
 * Procedure:
 * 1. Extract jdId from URL parameters and edited jdText from request body
 * 2. Validate that jdText is provided
 * 3. Query database for the job description
 * 4. Calculate new version number (current total + 1)
 * 5. Add new version entry to versions array with edited text
 * 6. Update currentVersion to the newly saved version
 * 7. Save the updated job description to database
 * 8. Return confirmation with new version number
 * 
 * @async
 * @param {Object} req - Express request with jdId in params and jdText in body
 * @param {Object} res - Express response object
 * @returns {Object} Success message with new version number
 */
export const saveEditedJD = async (req, res) => {
  try {
    // Extract job description ID from URL parameters
    const { jdId } = req.params;
    
    // Extract edited job description text from request body
    const { jdText } = req.body;

    // Validate that edited text is provided
    if (!jdText) return res.status(400).json({ message: "jdText is required" });

    // Query database for the job description
    const jd = await JobDescription.findById(jdId);
    
    // Return 404 if job description not found
    if (!jd) return res.status(404).json({ message: "JD not found" });

    // Calculate new version number based on existing versions count
    const newVersionNumber = jd.versions.length + 1;

    // Add the edited version to versions array
    jd.versions.push({
      version: newVersionNumber,
      jdText
    });

    // Set the newly edited version as the current active version
    jd.currentVersion = newVersionNumber;
    
    // Save all changes to database
    await jd.save();

    // Return success response with new version number
    res.status(200).json({ message: "New version saved", version: newVersionNumber });
  } catch (err) {
    // Return error response if operation fails
    res.status(500).json({ message: "Failed to save version", error: err.message });
  }
};
