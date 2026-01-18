/**
 * Main Express Server
 * 
 * Initializes and configures the Node.js/Express backend server.
 * Sets up middleware, database connection, and API routes.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// ============================================================
// MIDDLEWARE CONFIGURATION
// ============================================================
// Enable cross-origin requests from frontend
app.use(cors());

// Parse incoming JSON requests with 10MB size limit
app.use(express.json({ limit: "10mb" }));

// DEBUG: Log all requests
app.use((req, res, next) => {
  console.log(`📡 REQUEST RECEIVED: ${req.method} ${req.url}`);
  next();
});

// ============================================================
// TEST ROUTES
// ============================================================
// Top-level test route for debugging server initialization
app.get("/api/test-top", (req, res) => {
  console.log("🔥 /api/test-top HIT");
  res.json({ message: "Top Level Route Works" });
});

// ============================================================
// DATABASE CONNECTION
// ============================================================
// Import and initialize MongoDB connection
import connectDB from "./config/db.js";
connectDB();

// ============================================================
// API ROUTES
// ============================================================
// Authentication routes (login, signup)
import authRoutes from "./routes/authRoutes.js";
import * as authControllerDebug from "./controllers/authController.js";
console.log("🔍 DEBUG: Loaded login function source start:");
console.log(authControllerDebug.login.toString().substring(0, 2000)); 
console.log("🔍 DEBUG: Loaded login function source end");
app.use("/api/auth", authRoutes);

// Job description routes (generate, edit, version management)
import jobDescriptionRoutes from "./routes/jdRoutes.js";
app.use("/api/job-description", jobDescriptionRoutes);

// Resume parsing routes (upload, parse)
import resumeRoutes from "./routes/resume.router.js";
console.log("✅ Mounting resumeRoutes...");
console.log("👉 TYPE of resumeRoutes:", typeof resumeRoutes);
console.log("👉 Is Array?", Array.isArray(resumeRoutes));
app.use("/api/resume", resumeRoutes);

// ============================================================
// ADDITIONAL TEST ROUTES
// ============================================================
// Direct resume test route (for debugging)
app.get("/api/resume-test", (req, res) => {
  res.json({ message: "Direct Server Route Works" });
});

// ============================================================
// HEALTH CHECK & UTILITY ROUTES
// ============================================================
// Root health check endpoint
app.get("/", (req, res) => {
  res.send(`API running 🚀 (PID: ${process.pid})`);
});

// Basic test endpoint to verify server is responding
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

// ============================================================
// SERVER INITIALIZATION
// ============================================================
// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

// Start Express server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server updated at ${new Date().toISOString()}`);
});