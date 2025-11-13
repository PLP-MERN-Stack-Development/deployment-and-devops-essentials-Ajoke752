import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Register new user
router.post("/signup", async (req, res) => {
  // Ensure DB is connected before attempting DB operations
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({
        message: "Database not connected. Set MONGO_URI and restart backend.",
      });
  }
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Login existing user
router.post("/login", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({
        message: "Database not connected. Set MONGO_URI and restart backend.",
      });
  }
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Verify user session (for frontend auto-login)
router.get("/me", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({
        message: "Database not connected. Set MONGO_URI and restart backend.",
      });
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.get("/profile", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({
        message: "Database not connected. Set MONGO_URI and restart backend.",
      });
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
