import { Job } from '../models/Job.js';

/**
 * CREATE A NEW JOB POSTING
 */
export const createJob = async (req, res) => {
  try {
    const { 
      employerId, 
      title, 
      company, 
      location, 
      type, 
      isRemote, 
      salaryMin, 
      salaryMax, 
      experienceLevel, 
      description, 
      skills 
    } = req.body;

    if (!employerId || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newJob = await Job.create({
      employerId,
      title,
      company,
      location,
      type,
      isRemote: isRemote || false,
      salary: {
        min: salaryMin || 0,
        max: salaryMax || 0
      },
      experienceLevel: experienceLevel || 0,
      description,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

/**
 * GET ALL JOBS (With basic filtering)
 */
export const getAllJobs = async (req, res) => {
  try {
    // Optional query params for basic filtering could be added here
    // For now, we fetch all active jobs, sorted by newest first
    const jobs = await Job.find({ status: 'active' })
      .sort({ postedAt: -1 })
      .populate('employerId', 'name email'); // Populate employer info if needed

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

/**
 * GET SINGLE JOB BY ID
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate('employerId', 'name email');

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job details", error: err.message });
  }
};
