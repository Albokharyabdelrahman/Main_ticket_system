const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgetPassword } = require("../controllers/authController");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../Utils/sendEmail");




router.post("/register", registerUser); // Public
router.post("/login", loginUser);       // Public
router.put("/forgetPassword", async(req,res)); // Public
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  
    await sendEmail(user.email, "Your OTP", `Your OTP is: ${otp}`);
  
    res.json({ message: "OTP sent to email" });
  });
  
  router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    res.json({ message: "OTP verified" });
  });

  router.put("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
  
    await user.save();
    res.json({ message: "Password reset successful" });
  });

module.exports = router;
