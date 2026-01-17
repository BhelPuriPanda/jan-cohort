/**
 * MongoDB Database Connection Configuration
 * 
 * This module handles the connection to MongoDB using Mongoose ODM.
 * It verifies that the MongoDB URI is available and establishes a connection.
 */

import mongoose from "mongoose";

/**
 * Asynchronous function to establish a connection to MongoDB
 * 
 * Procedure:
 * 1. Validates that MONGO_URI environment variable is set
 * 2. Attempts to connect to MongoDB using Mongoose
 * 3. Logs success message on successful connection
 * 4. Catches and logs errors, then terminates the process
 * 
 * @async
 * @throws {Error} If MONGO_URI is not defined in environment variables
 * @returns {Promise<void>} Returns a promise that resolves when connection is established
 */
const connectDB = async () => {
    // Check if MONGO_URI environment variable exists in .env file
    // This URI should contain the complete MongoDB connection string
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set in .env");
  
  try {
    // Attempt to establish connection to MongoDB
    // mongoose.connect() returns a promise that resolves when connection is established
    await mongoose.connect(process.env.MONGO_URI);
    
    // Log successful connection to console
    console.log("MongoDB connected");
  } catch (err) {
    // If connection fails, log the error message
    console.error("Mongo error:", err.message);
    
    // Exit the process with error code 1 (indicates failure)
    // This prevents the application from running with a broken database connection
    process.exit(1);
  }
};

// Export the connectDB function as default export for use in main application file
export default connectDB;
