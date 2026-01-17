import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// POST /api/resume/parse
router.post("/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const pythonServiceUrl = "http://127.0.0.1:8000/api/resume/parse";

    // Prepare form data for Python service
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Send to Python backend
    const response = await axios.post(pythonServiceUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // Cleanup local file
    fs.unlinkSync(filePath);

    // Respond with data from Python service
    res.json(response.data);
  } catch (error) {
    console.error("Error parsing resume:", error.message);
    // Cleanup file if it exists and error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to parse resume", details: error.message });
  }
});

export default router;