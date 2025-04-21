const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require('../models/Event');


exports.updateProfile = async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  try {
    // Extract and verify JWT from cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the logged-in user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(400).json({ error: err.message || "Something went wrong" });
  }
};


exports.updateUserRole = async (req, res) => {
  const {role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) user.role = role;

    // Save the updated user to the database
    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user WITH password included
    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile fetched", user: user.toObject() });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
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

const Booking = require('../models/Booking');

exports.getUserBookings = async (req, res) => {
try {
  // Check if the user is authenticated
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // Find bookings for the authenticated user
  const bookings = await Booking.find({ userId: req.user.userId }).populate('eventId');

  res.json(bookings);
} catch (err) {
  console.error("Error fetching user bookings:", err); // Log the error
  res.status(500).json({ error: err.message });
}
};


exports.getAnalytics = async (req, res) => {
try {
  // 🔐 Check if user is authenticated and is an Organizer
  if (!req.user || !req.user.userId || req.user.role !== "Organizer") {
    console.log("Unauthorized access attempt by user:", req.user);
    return res.status(403).json({ error: "Only organizers can access analytics" });
  }

  // 🔍 Find events for this organizer (with ID verification)
  const events = await Event.find({ 
    organizerId: req.user.userId 
  });

  if (!events.length) {
    console.log("No events found for organizer:", req.user.userId);
    return res.status(404).json({ error: "No events found for this organizer" });
  }

  // 📊 Calculate analytics
  const analytics = events.map(event => {
    // Verify organizer owns this event (additional security check)
    if (event.organizerId.toString() !== req.user.userId.toString()) {
      console.log("Organizer ID mismatch for event:", event._id);
      return null;
    }

    const percentageBooked = ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100;
    return {
      eventId: event._id,
      title: event.title,
      percentageBooked: percentageBooked.toFixed(2)
    };
  }).filter(analytic => analytic !== null);

  res.status(200).json(analytics);
} catch (err) {
  console.error("Analytics error:", err);
  res.status(500).json({ error: "Server error while fetching analytics" });
  }
};