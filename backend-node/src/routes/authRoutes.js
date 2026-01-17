/**
 * Authentication Routes
 * 
 * Defines API endpoints for user authentication operations.
 * Routes are prefixed with /auth in the main server file.
 */

import express from "express";
import { login, signup } from "../controllers/authController.js";

// Create Express router instance
const router = express.Router();

// POST /auth/login - Authenticate user with email, password, and role
router.post("/login", login);

// POST /auth/signup - Create new user account
router.post("/signup", signup);

// Export router for use in main application
export default router;
