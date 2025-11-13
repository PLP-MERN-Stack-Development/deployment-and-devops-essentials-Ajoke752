const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const WasteReport = require("../models/WasteReport");

const JWT_SECRET = process.env.JWT_SECRET;

// 🧠 Register new farmer
exports.registerFarmer = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: "farmer",
    });

    res.status(201).json({
      message: "Farmer registered successfully",
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 🔐 Farmer login
exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "farmer" });
    if (!user) return res.status(404).json({ message: "Farmer not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 📜 Get farmer's waste history
exports.getWasteHistory = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const reports = await WasteReport.find({ farmerId }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching waste history" });
  }
};
