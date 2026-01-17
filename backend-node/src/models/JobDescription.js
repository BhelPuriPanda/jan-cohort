/**
 * Job Description Model
 * 
 * Defines the schema for storing job descriptions with multiple versions,
 * input parameters, and analysis metadata.
 */

import mongoose from "mongoose";

/**
 * JD Version Schema
 * 
 * Represents a single version of a generated job description.
 * Stores the generated text and associated analysis metrics.
 */
const jdVersionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },  // Version number (1, 2, 3, etc.)
    jdText: { type: String, required: true },   // The actual job description text

    // Analysis metadata for quality assessment
    readabilityScore: Number,                   // Flesch Reading Ease score
    diIssues: [String],                         // Diversity & Inclusion issues found
    seoKeywords: [String],                      // Extracted SEO keywords
    createdAt: { type: Date, default: Date.now } // Timestamp of creation
  },
  { _id: false }  // Don't create separate _id for version subdocuments
);

/**
 * Job Description Schema
 * 
 * Main schema for storing complete job description documents with:
 * - Original input parameters
 * - Multiple generated versions
 * - Currently active version tracking
 */
const jobDescriptionSchema = new mongoose.Schema(
  {
    // Reference to the employer (user) who created this JD
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Original input parameters used to generate the JD
    input: {
      jobTitle: String,                         // Job title
      industry: String,                         // Industry/sector
      experienceLevel: String,                  // Required experience level
      keySkills: [String],                      // Array of required skills
      companyCulture: String,                   // Company culture description
      specialRequirements: String               // Any special requirements
    },

    // Array of all generated versions (A/B test variations)
    versions: [jdVersionSchema],

    // Tracks which version is currently active
    currentVersion: {
      type: Number,
      default: 1  // First version is active by default
    }
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create and export the JobDescription model
export const JobDescription = mongoose.model("JobDescription", jobDescriptionSchema);