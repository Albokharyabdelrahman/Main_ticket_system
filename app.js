require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Import routes
const authRoutes = require("./Routes/authRoutes.js"); // Authentication routes (register, login, etc.)
const userRoutes = require("./Routes/userRoutes.js"); // User-related routes (profile, etc.)
const eventRoutes = require("./Routes/eventRoutes.js"); // Event-related routes
const bookingRoutes = require("./Routes/bookingRoutes.js"); // Booking-related routes

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Enable CORS if needed
app.use(cors());

// MongoDB connection
const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

// Check if Mongo URI is provided
if (!MONGO_URI) {
    console.error("❌ MongoDB URI not provided in .env");
    process.exit(1);
}

// Connect to MongoDB (Updated)
const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI); // Removed deprecated options
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit on DB connection failure
    }
};
connectToDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Ticket Booking System API 🎟️");
});

// Routes for authentication, user management, events, and bookings
app.use("/api/v1", authRoutes); // Authentication routes (register, login, forgetPassword)
app.use("/api/v1/users", userRoutes); // User-related routes (profile, update, etc.)
app.use("/api/v1/events", eventRoutes); // Event-related routes
app.use("/api/v1/bookings", bookingRoutes); // Booking-related routes

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Export the app for testing
