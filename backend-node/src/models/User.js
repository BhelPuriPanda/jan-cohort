/**
 * User Model
 * 
 * Defines the schema for user accounts with authentication and role-based access.
 */

import mongoose from "mongoose";

/**
 * User Schema
 * 
 * Stores user account information with role-based differentiation between
 * employees and employers.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                    // User's full name
    email: { type: String, required: true, unique: true },     // Email (unique identifier)
    password: { type: String, required: true },                // Password for authentication
    role: { type: String, enum: ["employee", "employer"], required: true }  // User type: employee or employer
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create and export User model as named export
export const User = mongoose.model("User", userSchema);
