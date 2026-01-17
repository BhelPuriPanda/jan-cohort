import mongoose from "mongoose";

const jdVersionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    jdText: { type: String, required: true },

    // Metadata (future features)
    readabilityScore: Number,
    diIssues: [String],
    seoKeywords: [String],
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const jobDescriptionSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    input: {
      jobTitle: String,
      industry: String,
      experienceLevel: String,
      keySkills: [String],
      companyCulture: String,
      specialRequirements: String
    },

    versions: [
      {
        version: Number,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    currentVersion: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export const JobDescription = mongoose.model("JobDescription",jobDescriptionSchema);