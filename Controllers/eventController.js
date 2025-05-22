const Event = require("../models/Event");
const User = require("../models/User");

exports.createEvent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Organizer") {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    // Get file path from multer
    const imagePath = req.file ? req.file.path : null;
    
    const event = new Event({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      availableTickets: req.body.availableTickets,
      totalTickets: req.body.totalTickets,
      organizerId: req.user.userId,
      image: imagePath, // Store file path
      date: new Date(),
      status: 'pending'
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all events
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateEvent = async (req, res) => {
  const { title, date, location, totalTickets, price,status} = req.body;

  try {
    if (!req.user || !req.user.userId || !["Organizer", "Admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "You are not authorized to update events." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const isOrganizer = event.organizerId.toString() === req.user.userId.toString();
    if (req.user.role === "Organizer" && !isOrganizer) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
    }

    if (title !== undefined) event.title = title;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (totalTickets !== undefined) {
      // Update according to your schema
      event.totalTickets = totalTickets; // or event.tickets.total = totalTickets;
    }
    if (price !== undefined) event.price = price;
    if (status !== undefined) event.status = status;

    await event.save();
    console.log("Updated event:", event); // Debug

    res.status(200).json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete event (only organizers can delete their events)
// controllers/eventController.js

// controllers/eventController.js
exports.deleteEvent = async (req, res) => {
  try {
    // 🔐 Confirm user is authenticated and has a valid role
    if (!req.user || !req.user.userId || !["Organizer", "Admin"].includes(req.user.role)) {
      console.log("User not authorized or not logged in:", req.user);
      return res.status(403).json({ error: "You are not authorized to delete events." });
    }

    // 🔍 Find the event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log("Event not found with ID:", req.params.id);
      return res.status(404).json({ error: "Event not found" });
    }

    // 👮 Check Organizer access (only if not Admin)
    const isOrganizer = event.organizerId.toString() === req.user.userId.toString();
    if (req.user.role === "Organizer" && !isOrganizer) {
      console.log("Access denied: Organizer ID mismatch. Event:", event.organizerId.toString(), "User:", req.user.userId.toString());
      return res.status(403).json({ error: "You are not authorized to delete this event" });
    }

    // 🗑 Delete the event
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error while deleting event." });
  }
};



// Change event status (only admins can approve/reject)
exports.changeEventStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Admins can update the status
    event.status = status;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};