import express from "express";
import { generateJobDescriptionAB } from "../controllers/jdController.js";

const router = express.Router();

// POST /api/job-description
router.post("/generate-ab", generateJobDescriptionAB);

export default router;
