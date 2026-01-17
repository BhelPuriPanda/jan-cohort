import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ✅ Middleware first
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/test-top", (req, res) => {
  console.log("🔥 /api/test-top HIT");
  res.json({ message: "Top Level Route Works" });
});

// ✅ DB connection
import connectDB from "./config/db.js";
connectDB();

// ✅ Auth routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import jobDescriptionRoutes from "./routes/jdRoutes.js";
app.use("/api/job-description", jobDescriptionRoutes);

import resumeRoutes from "./routes/resume.router.js";
console.log("✅ Mounting resumeRoutes...");
console.log("👉 TYPE of resumeRoutes:", typeof resumeRoutes);
console.log("👉 Is Array?", Array.isArray(resumeRoutes));
app.use("/api/resume", resumeRoutes);

app.get("/api/resume-test", (req, res) => {
  res.json({ message: "Direct Server Route Works" });
});

// Health check
app.get("/", (req, res) => {
  res.send(`API running 🚀 (PID: ${process.pid})`);
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});