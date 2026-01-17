import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ✅ Middleware first
app.use(cors());
app.use(express.json());

// ✅ DB connection
import connectDB from "./config/db.js";
connectDB();

// ✅ Auth routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import jobDescriptionRoutes from "./routes/jdRoutes.js";
app.use("/api/job-description", jobDescriptionRoutes);

import resumeRoutes from "./routes/resumeRoutes.js";
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});