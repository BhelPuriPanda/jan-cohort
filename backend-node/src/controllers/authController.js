/**
 * Authentication Controller
 * 
 * This module handles all authentication-related operations including user login and signup.
 * It manages user credentials, roles, and communicates with the User model.
 */

import  { User } from "../models/User.js";

/**
 * LOGIN Controller
 * 
 * Handles user authentication by verifying email, password, and role.
 * 
 * Procedure:
 * 1. Extract email, password, and role from request body
 * 2. Query the database to find user by email
 * 3. Validate user exists and credentials match (password and role)
 * 4. Return user email and role on success, or error message on failure
 * 
 * @async
 * @param {Object} req - Express request object containing email, password, role in body
 * @param {Object} res - Express response object for sending JSON responses
 * @returns {Object} JSON response with email, role, and success/error message
 */
export const login = async (req, res) => {
  // Destructure credentials from request body
  const { email, password, role } = req.body;
  
  try {    
    // Query database to find user by email
    const user = await User.findOne({ email });

    // Check if user exists (early return to avoid multiple checks)
    if(!user){
      return res.status(401).json({ message: "User does not exist" });
    }

    // Validate password and role match stored values
    // Note: In production, passwords should be hashed and compared using bcrypt
    if (!user || user.password !== password || user.role !== role) {
      return res.status(401).json({ message: "Invalid credentials or role" });
    }

    // Return only non-sensitive information (email and role)
    res.json({
      email: user.email,
      role: user.role,
      message: "Login successful"
    });
  } catch (err) {
    // Catch database or server errors and return 500 status
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * SIGNUP Controller
 * 
 * Handles new user registration and account creation.
 * 
 * Procedure:
 * 1. Extract name, email, password, and role from request body
 * 2. Check if email already exists in database
 * 3. If email doesn't exist, create new user document
 * 4. Return newly created user's email and role
 * 
 * @async
 * @param {Object} req - Express request object containing name, email, password, role in body
 * @param {Object} res - Express response object for sending JSON responses
 * @returns {Object} JSON response with email, role, and success/error message
 */
export const signup = async (req, res) => {
  // Destructure user registration data from request body
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user with this email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // Create new user document in database with provided information
    const user = await User.create({ name, email, password, role });
    
    // Return newly created user's email and role
    res.json({
      email: user.email,
      role: user.role,
      message: "User created successfully"
    });
  } catch (err) {
    // Catch database or validation errors and return 500 status
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
