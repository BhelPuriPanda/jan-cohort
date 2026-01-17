import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "employer"], required: true }
  },
  { timestamps: true }
);

// Named export instead of default
export const User = mongoose.model("User", userSchema);
