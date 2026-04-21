const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { registerUser, loginUser, forgotPassword,forgetOldPassword,logOut, verifyEmail, resendOtp } = require("../Controllers/authController");



router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);       // Public
router.put("/forgetPassword", forgotPassword); // Public
router.post("/logout", logOut);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
module.exports = router;

