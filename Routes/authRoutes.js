const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgetPassword,
  verifyOtp,
  resetPassword
} = require("../Controllers/authController");

router.post("/register", registerUser);         // Public
router.post("/login", loginUser);               // Public
router.put("/forgetPassword", forgetPassword);  // Public
router.post("/verify-otp", verifyOtp);          // Public
router.put("/reset-password", resetPassword);   // Public

module.exports = router;