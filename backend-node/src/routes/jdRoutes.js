import express from "express";
import { generateJobDescription } from "../controllers/jdController.js";

const router = express.Router();

// POST /api/job-description
router.post("/", generateJobDescription);

export default router;
