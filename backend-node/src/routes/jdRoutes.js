/**
 * Job Description Routes
 * 
 * Defines API endpoints for job description generation, retrieval, and version management.
 * Routes are prefixed with /api/job-description in the main server file.
 */

import express from "express";
import { generateJobDescriptionAB , getJD , saveEditedJD , switchJDVersion } from "../controllers/jdController.js";

// Create Express router instance
const router = express.Router();

// POST /api/job-description/generate-ab - Generate A/B variations of job description
router.post("/generate-ab", generateJobDescriptionAB);

// GET /api/job-description/:jdId - Retrieve job description by ID
router.get("/:jdId", getJD);

// PATCH /api/job-description/:jdId/save-version - Save edited JD as new version
router.patch("/:jdId/save-version", saveEditedJD);

// PATCH /api/job-description/:jdId/switch-version - Switch to different JD version
router.patch("/:jdId/switch-version", switchJDVersion);

// Export router for use in main application
export default router;
