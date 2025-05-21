const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { registerUser, loginUser, forgotPassword,forgetOldPassword} = require("../Controllers/authController");


router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);       // Public
router.put("/forgetPassword", forgotPassword); // Public
module.exports = router;
