const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require('../models/Event');


exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  // multer adds uploaded file info to req.file
  const profilePictureFile = req.file;

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Save uploaded file path or URL to profilePicture field
    if (profilePictureFile) {
      user.profilePicture = profilePictureFile.path; // or URL if you serve static files differently
    }

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

    const userObj = user.toObject();

    if (userObj.profilePicture) {
    userObj.profilePic = `data:image/jpeg;base64,${userObj.profilePicture}`;
    } else {
    userObj.profilePic = null;
    }

  res.json({ message: "Profile fetched", user: userObj });

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
    // 🔐 Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized - Please log in" });
    }

    // Determine which field to filter by based on user role
    let filterField;
    if (req.user.role === "Organizer") {
      filterField = { organizerId: req.user.userId };
    } else if (req.user.role === "User") {
      filterField = { attendees: req.user.userId }; // Assuming events have an attendees array
    } else {
      return res.status(403).json({ error: "Access denied for your role" });
    }

    // 🔍 Find events for this user
    const events = await Event.find(filterField);

    if (!events.length) {
      return res.status(404).json({ 
        message: "No events found",
        suggestion: req.user.role === "Organizer" 
          ? "Create your first event" 
          : "Browse and book events"
      });
    }

    // 📊 Calculate analytics
    const analytics = events.map(event => {
      // Additional security check for organizers
      if (req.user.role === "Organizer" && 
          event.organizerId.toString() !== req.user.userId.toString()) {
        return null; // Skip events that don't belong to this organizer
      }

      // Different analytics for different roles
      if (req.user.role === "Organizer") {
        const percentageBooked = ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100;
        return {
          eventId: event._id,
          title: event.title,
          percentageBooked: percentageBooked.toFixed(2),
          revenue: event.price * (event.totalTickets - event.availableTickets)
        };
      } else { // For regular users
        return {
          eventId: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          status: event.status
        };
      }
    }).filter(analytic => analytic !== null);

    res.status(200).json({
      role: req.user.role,
      totalEvents: analytics.length,
      analytics
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Server error while fetching analytics" });
  }
  
};

exports.getMyEvents = async (req, res) => {
  try {
    // 1️⃣ Verify the user is an organizer
    if (req.user.role !== "Organizer") {
      return res.status(403).json({ 
        error: "Access denied. Organizer privileges required." 
      });
    }

    // 2️⃣ Find all events for this organizer
    const events = await Event.find({ 
      organizerId: req.user.userId 
    }).select('-__v'); // Exclude the version key

    if (!events.length) {
      return res.status(200).json({
        message: "You haven't created any events yet",
        suggestion: "Create your first event using the POST /events endpoint"
      });
    }

    // 3️⃣ Format the response
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      location: event.location,
      status: event.status,
      tickets: {
        total: event.totalTickets,
        available: event.availableTickets
      },
      createdAt: event.createdAt
    }));

    res.status(200).json({
      count: formattedEvents.length,
      events: formattedEvents
    });

  } catch (err) {
    console.error("GetMyEvents error:", err);
    res.status(500).json({ 
      error: "Failed to retrieve your events",
      details: err.message 
    });
  }
};
