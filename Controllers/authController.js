const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
    const { email, password, username, role } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword, // Save the hashed password, not the plain one
        role,
      });
  
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
// Login an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Entered Password:', password);
    console.log('Hashed Password in DB:', user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Password Reset functionality (Placeholder for now)
exports.forgetPassword = async (req, res) => {
  // Password reset logic goes here
  res.status(501).json({ message: "Password reset functionality is not implemented yet." });
};
