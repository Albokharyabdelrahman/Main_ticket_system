const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require('../models/Event');


exports.updateProfile = async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update only the fields provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Exclude password in response
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.json({ message: "Profile updated", user: userWithoutPassword });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const {role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) user.role = role;

    // Save the updated user to the database
    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID (for admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};