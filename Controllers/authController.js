const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
exports.forgetPassword = async (req, res) => {
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
