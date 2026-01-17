/**
 * Resume Routes
 * 
 * Defines API endpoints for resume parsing and file handling.
 * Routes are prefixed with /api/resume in the main server file.
 */

import express from "express";
import multer from "multer";
import { parseResumeController } from "../controllers/resume.controller.js";

// Create Express router instance
const router = express.Router();

// Log that router file has been loaded
console.log("✅ resume.route.js FILE LOADED");

// Configure multer for file uploads to "uploads/" directory
const upload = multer({ dest: "uploads/" });

// GET /api/resume/ping - Health check endpoint
router.get("/ping", (req, res) => res.json({ message: "PONG" }));

// POST /api/resume/parse - Upload and parse resume file
// Expects single file upload with field name "resume"
router.post("/parse", upload.single("resume"), parseResumeController);

// Export router for use in main application
export default router;
