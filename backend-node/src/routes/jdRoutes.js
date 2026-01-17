import express from "express";
import { generateJobDescriptionAB , getJD , saveEditedJD , switchJDVersion } from "../controllers/jdController.js";

const router = express.Router();

// POST /api/job-description
router.post("/generate-ab", generateJobDescriptionAB);
router.get("/:jdId", getJD);
router.patch("/:jdId/save-version", saveEditedJD);
router.patch("/:jdId/switch-version", switchJDVersion);

export default router;
