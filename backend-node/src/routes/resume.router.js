import express from "express";
import multer from "multer";
import { parseResumeController } from "../controllers/resume.controller.js";

const router = express.Router();
console.log("✅ resume.route.js FILE LOADED");
const upload = multer({ dest: "uploads/" });

router.get("/ping", (req, res) => res.json({ message: "PONG" }));
router.post("/parse", upload.single("resume"), parseResumeController);

export default router;
