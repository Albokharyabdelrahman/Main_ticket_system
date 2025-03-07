require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const User = require("./models/user.model");
const Event = require("./models/event.model");
const Booking = require("./models/booking.model");

const app = express();
app.use(express.json()); // Middleware for JSON parsing

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 🔹 Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Ticket Booking System API 🎟️");
});

// ======================= 🆕 USER ROUTES =======================

// 🔹 Register a new user
app.post("/users", async (req, res) => {
    try {
        const { name, email, password, profilePicture, role } = req.body;
        const user = new User({ name, email, password, profilePicture, role });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔹 Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================= 🆕 EVENT ROUTES =======================

// 🔹 Create a new event (Only organizers can create)
app.post("/events", async (req, res) => {
    try {
        const { title, location, price, category, description, availableTickets, totalTickets, organizerId, image, Date } = req.body;

        // Verify if organizerId belongs to an organizer
        const organizer = await User.findById(organizerId);
        if (!organizer || organizer.role !== "Organizer") {
            return res.status(403).json({ error: "Only organizers can create events" });
        }

        const event = new Event({ title, location, price, category, description, availableTickets, totalTickets, organizerId, image, Date });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔹 Get all events
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Get a single event by ID
app.get("/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================= 🆕 BOOKING ROUTES =======================

// 🔹 Book tickets for an event
app.post("/bookings", async (req, res) => {
    try {
        const { userId, eventId, ticketsBooked, totalPrice, bookingDate } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Ensure enough tickets are available
        if (event.availableTickets < ticketsBooked) {
            return res.status(400).json({ error: "Not enough tickets available" });
        }

        // Reduce available tickets
        event.availableTickets -= ticketsBooked;
        await event.save();

        const booking = new Booking({ userId, eventId, ticketsBooked, totalPrice, bookingDate, status: "pending" });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🔹 Get all bookings
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().populate("userId").populate("eventId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Get bookings by user ID
app.get("/bookings/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate("eventId");
        if (!bookings.length) {
            return res.status(404).json({ error: "No bookings found for this user" });
        }
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Cancel a booking
app.put("/bookings/:id/cancel", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Update status
        booking.status = "cancelled";
        await booking.save();

        // Restore tickets
        const event = await Event.findById(booking.eventId);
        if (event) {
            event.availableTickets += booking.ticketsBooked;
            await event.save();
        }

        res.json({ message: "Booking cancelled successfully", booking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================= 🆕 START SERVER =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
