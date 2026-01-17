import extractText from "../services/pdf.service.js";
import parseResume from "../services/parser.service.js";
import fs from "fs";

export const parseResumeController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    const text = await extractText(req.file.path);
    const parsed = parseResume(text);

    // Delete temp file after parsing
    fs.unlinkSync(req.file.path);

    res.json({ success: true, parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
