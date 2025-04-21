const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgotPassword,forgetOldPassword} = require("../Controllers/authController");

router.post("/register", registerUser); // Public
router.post("/login", loginUser);       // Public
router.put("/forgetPassword", forgotPassword); // Public
module.exports = router;
