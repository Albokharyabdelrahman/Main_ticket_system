const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgetPassword } = require("../Controllers/authController");

router.post("/register", registerUser); // Public
router.post("/login", loginUser);       // Public
router.put("/forgetPassword", forgetPassword); // Public

module.exports = router;
