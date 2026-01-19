import express from 'express';
import { createJob, getAllJobs, getJobById } from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs
router.post('/', createJob);

// GET /api/jobs
router.get('/', getAllJobs);

// GET /api/jobs/:id
router.get('/:id', getJobById);

export default router;
