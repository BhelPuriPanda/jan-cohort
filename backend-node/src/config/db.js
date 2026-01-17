import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set in .env");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
