const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;


// Update Profile (any user)
exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID (for admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User Role (for admin)
exports.updateUserRole = async (req, res) => {
    const { name, email, password, role, profilePicture } = req.body;
  
    try {
      // Find the user by ID
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Update fields only if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;  // You should hash the password before saving
      if (role) user.role = role;
      if (profilePicture) user.profilePicture = profilePicture;
  
      // Save the updated user to the database
      await user.save();
      res.json({ message: "User updated", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Delete User (for admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Bookings (for user)
exports.getUserBookings = async (req, res) => {
  try {
    // Assuming the user has a 'bookings' field that stores booking data
    const user = await User.findById(req.user._id).populate("bookings");
    res.json(user.bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Events (for organizer)
exports.getUserEvents = async (req, res) => {
  try {
    // Assuming the user has an 'events' field that stores event data
    const user = await User.findById(req.user._id).populate("events");
    res.json(user.events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Event Analytics (for organizer)
exports.getUserEventAnalytics = async (req, res) => {
  try {
    // Example function, replace with actual logic
    const user = await User.findById(req.user._id).populate("events");
    const analytics = user.events.map(event => ({
      eventName: event.name,
      bookingsCount: event.bookings.length
    }));
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
