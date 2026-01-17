/**
 * Resume Controller
 * 
 * Handles resume file uploads and parsing operations.
 */

import extractText from "../services/pdf.service.js";
import parseResume from "../services/parser.service.js";
import fs from "fs";

/**
 * Parse Resume Controller
 * 
 * Handles the resume parsing workflow:
 * 1. Validate file upload
 * 2. Extract text from PDF file
 * 3. Parse text into structured resume data
 * 4. Clean up temporary file
 * 5. Return parsed resume
 * 
 * @async
 * @param {Object} req - Express request with file upload
 * @param {Object} res - Express response object
 * @returns {Object} JSON with success status and parsed resume data
 */
export const parseResumeController = async (req, res) => {
  try {
    // Check if file was uploaded in the request
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    // Extract text content from the uploaded PDF file
    const text = await extractText(req.file.path);
    
    // Parse extracted text into structured resume fields
    const parsed = parseResume(text);

    // Delete temporary file after successful parsing
    fs.unlinkSync(req.file.path);

    // Return parsed resume data to client
    res.json({ success: true, parsed });
  } catch (err) {
    // Return error response if parsing fails
    res.status(500).json({ success: false, error: err.message });
  }
};
