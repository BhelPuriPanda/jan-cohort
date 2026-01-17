import  { User } from "../models/User.js";

// LOGIN
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {    
    const user = await User.findOne({ email });

    if(!user){
      return res.status(401).json({ message: "User does not exist" });
    }

    if (!user || user.password !== password || user.role !== role) {
      return res.status(401).json({ message: "Invalid credentials or role" });
    }

    // Only return email + role
    res.json({
      email: user.email,
      role: user.role,
      message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// SIGNUP / SEED USERS
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role });
    res.json({
      email: user.email,
      role: user.role,
      message: "User created successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
