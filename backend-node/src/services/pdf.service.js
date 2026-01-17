/**
 * PDF Text Extraction Service
 * 
 * Extracts plain text from PDF files for further processing.
 */

import fs from "fs";
import { createRequire } from "module";

// Create require function to use CommonJS modules in ES6
const require = createRequire(import.meta.url);

// Import pdf-parse (CommonJS module for PDF text extraction)
const pdfParse = require("pdf-parse");

/**
 * Extract text from a PDF file
 * 
 * Procedure:
 * 1. Read PDF file from disk as buffer
 * 2. Parse buffer using pdf-parse library
 * 3. Extract text content from parsed PDF data
 * 4. Return extracted text string
 * 
 * @async
 * @param {string} filePath - Path to the PDF file to extract text from
 * @returns {Promise<string>} Extracted text content from the PDF
 */
const extractText = async (filePath) => {
  // Read PDF file from disk into memory as buffer
  const buffer = fs.readFileSync(filePath);
  
  // Parse PDF buffer and extract text data
  const data = await pdfParse(buffer);
  
  // Return extracted text string
  return data.text;
};

// Export extractText function as default export
export default extractText;
