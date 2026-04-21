require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import routes
const authRoutes = require("./Routes/authRoutes.js"); // Authentication routes (register, login, etc.)
const userRoutes = require("./Routes/userRoutes.js"); // User-related routes (profile, etc.)
const eventRoutes = require("./Routes/eventRoutes.js"); // Event-related routes
const bookingRoutes = require("./Routes/bookingRoutes.js"); // Booking-related routes
const ticketRoutes = require("./Routes/ticketRoutes.js"); // Ticket-related routes

const app = express();
app.use(cookieParser());
// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS if needed
app.use(cors({
  origin: "http://localhost:5173",    // Your frontend URL
  credentials: true                   // Allow cookies and credentials
}));

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache middleware
const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse && Date.now() - cachedResponse.timestamp < duration) {
      return res.json(cachedResponse.data);
    }
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      cache.set(key, {
        data: data,
        timestamp: Date.now()
      });
      
      // Call original method
      originalJson.call(this, data);
    };
    
    next();
  };
};

// Clear cache every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);

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
app.use("/api/v1/events", cacheMiddleware(), eventRoutes); // Event-related routes
app.use("/api/v1/bookings", bookingRoutes); // Booking-related routes
app.use("/api/v1/tickets", ticketRoutes); // Ticket-related routes

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = app; // Export the app for testing
