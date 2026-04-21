const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require('crypto');
const postmark = require("postmark");
const otpStore = new Map();
const client = new postmark.ServerClient("ad6fc1db-6e07-461f-a127-de40809fddd7");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage }); // Use in your route

const fs = require("fs");
const path = require("path");
const { sendVerificationEmail } = require('../Utils/sendEmail');
const PendingUser = require('../models/PendingUser');

exports.registerUser = async (req, res) => {
  const { name, email, password, role, birthdate, phone, gender } = req.body;
  let profilePicture = undefined;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: "All fields (name, email, password, role) are required.",
    });
  }

  // Validate role
  if (!["User", "Organizer"].includes(role)) {
    return res.status(400).json({
      error: "Invalid role. Must be either 'User' or 'Organizer'.",
    });
  }

  // Validate required fields based on role
  if (role === "User") {
    if (!birthdate || !phone || !gender) {
      return res.status(400).json({
        error: "For User registration, birthdate, phone, and gender are required.",
      });
    }
    if (!["Male", "Female", "Prefer not to mention"].includes(gender)) {
      return res.status(400).json({
        error: "Gender must be 'Male', 'Female', or 'Prefer not to mention'.",
      });
    }
  } else if (role === "Organizer") {
    if (!phone) {
      return res.status(400).json({
        error: "For Organizer registration, phone is required.",
      });
    }
  }

  // Only allow @gmail.com emails
  if (!/^[^@\s]+@gmail\.com$/.test(email)) {
    return res.status(400).json({ error: "Only Gmail addresses are allowed for registration." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      return res.status(400).json({ error: "A verification is already pending for this email. Please check your email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (req.file) {
      const buffer = req.file.buffer;
      profilePicture = buffer.toString("base64");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newPendingUser = new PendingUser({
      name,
      email,
      password: hashedPassword,
      role,
      profilePicture,
      birthdate: role === "User" ? birthdate : null,
      phone: phone || null,
      gender: role === "User" ? gender : null,
      otp,
      otpExpires,
    });

    await newPendingUser.save();

    // Send verification email with OTP (no link, just OTP)
    const html = `<p>Welcome to BookedIn! Your OTP code is: <b>${otp}</b> (valid for 10 minutes)</p>`;
    await sendVerificationEmail(email, 'Verify your BookedIn account', html);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      email
    });
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
      httpOnly: false,         // prevent JS access
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


exports.logOut = async (req, res) => {
  console.log("work");
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Successfully logged out." });
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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

  try {
    await sendVerificationEmail(
      email,
      'BookedIn Password Reset OTP',
      `<p>Your OTP code for resetting your password is: <b>${otp}</b> (valid for 10 minutes)</p>`
    );
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

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp: generatedOtp, expiresAt: Date.now() + 10 * 60 * 1000 });

    try {
      await sendVerificationEmail(
        email,
        'BookedIn Password Reset OTP',
        `<p>Your OTP code for resetting your password is: <b>${generatedOtp}</b> (valid for 10 minutes)</p>`
      );
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

// POST /api/v1/verify-email
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }
  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(400).json({ message: 'No pending registration found for this email.' });
    }
    if (!pendingUser.otp || pendingUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
    if (!pendingUser.otpExpires || pendingUser.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }
    // Move to User collection
    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role,
      profilePicture: pendingUser.profilePicture,
      birthdate: pendingUser.birthdate,
      phone: pendingUser.phone,
      country: pendingUser.country,
      gender: pendingUser.gender,
      isVerified: true,
      verificationToken: undefined,
      otp: undefined,
      otpExpires: undefined,
    });
    await newUser.save();
    await PendingUser.deleteOne({ _id: pendingUser._id });
    return res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/v1/resend-otp
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(404).json({ message: 'No pending registration found for this email.' });
    }
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    pendingUser.otp = otp;
    pendingUser.otpExpires = otpExpires;
    await pendingUser.save();
    // Resend verification email
    const verificationUrl = `http://localhost:3000/verify-email?token=${pendingUser.verificationToken}&email=${encodeURIComponent(email)}`;
    const html = `<p>Welcome to BookedIn! Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p><p>Your new OTP code is: <b>${otp}</b> (valid for 10 minutes)</p>`;
    await sendVerificationEmail(email, 'Verify your BookedIn account (Resent OTP)', html);
    return res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};
