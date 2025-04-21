const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require('crypto');
const postmark = require("postmark");
const otpStore = new Map();
const client = new postmark.ServerClient("ad6fc1db-6e07-461f-a127-de40809fddd7");

exports.registerUser = async (req, res) => {
  const { name, email, password, role, profilePicture } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: "All fields (name, email, password, role) are required.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture, // Optional field, can be undefined
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Server error during registration:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔐 Send JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,         // prevent JS access
      secure: false,          // true in production with HTTPS
      sameSite: "Lax",        // or "Strict"/"None" depending on setup
      maxAge: 60 * 60 * 1000  // 1 hour
    });

	res.status(200).json({ token });  } catch (err) 
{
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Password Reset functionality (Placeholder for now)
// Password Reset functionality
exports.forgetOldPassword = async (req, res) => {
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    // Find user by both name and email
    const user = await User.findOne({ name, email });

    if (!user) {
      return res.status(404).json({ error: "User not found with the provided name and email." });
    }

    // Generate a secure 10-character random password
    const generateRandomPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
    };

    const newPlainPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    // Update user password in the database
    user.password = hashedPassword;
    await user.save();

    // Respond with new password (you might email this in a real app)
    return res.status(200).json({
      message: "Password has been reset successfully.",
      newPassword: newPlainPassword
    });

  } catch (err) {
    console.error("Server error during password reset:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
// Send OTP to user's email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const otp = crypto.randomInt(100000, 999999);

  // Store OTP with expiration
  otpStore.set(email, { otp, expiresAt: Date.now() + 500000 * 60 * 1000 });

  try {
    await client.sendEmail({
      From: "yassin.azab@student.giu-uni.de",
      To: email,
      Subject: "Your OTP Code",
      TextBody: `Your OTP code is ${otp}`,
      HtmlBody: `<p>Your OTP code is <strong>${otp}</strong></p>`,
      MessageStream: "outbound",
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP
exports.forgotPassword = async (req, res) => {
  const { email, otp, newPassword, mode } = req.body;

  if (!email || !mode) return res.status(400).json({ message: "Email and mode are required" });

  if (mode === "send") {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const generatedOtp = crypto.randomInt(100000, 999999);
    otpStore.set(email, { otp: generatedOtp, expiresAt: Date.now() + 500000 * 60 * 1000 });

    try {
      await client.sendEmail({
        From: "yassin.azab@student.giu-uni.de",
        To: email,
        Subject: "Your OTP Code",
        TextBody: `Your OTP code is ${generatedOtp}`,
        HtmlBody: `<p>Your OTP code is <strong>${generatedOtp}</strong></p>`,
        MessageStream: "outbound",
      });

      return res.json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("Error sending OTP:", err);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  }

  if (mode === "verify") {
    if (!otp || !newPassword) {
      return res.status(400).json({ message: "OTP and new password are required" });
    }

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: "No OTP found for this email" });

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", expectedOtp: stored.otp });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );

      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      otpStore.delete(email);
      return res.json({ message: "Password updated successfully", newPassword, hashedPassword });
    } catch (err) {
      console.error("Error updating password:", err);
      return res.status(500).json({ message: "Failed to update password" });
    }
  }

  res.status(400).json({ message: "Invalid mode" });
};
