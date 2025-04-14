const Event = require("../models/Event");
const User = require("../models/User");

// Create Event
exports.createEvent = async (req, res) => {
  const { title, location, price, category, description, availableTickets, totalTickets, image, organizerId } = req.body;

  try {
    // Check if the organizerId is provided in the body
    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required" });
    }

    // Create a new event with the provided organizerId
    const event = new Event({
      title,
      location,
      price,
      category,
      description,
      availableTickets,
      totalTickets,
      organizerId, // Use the organizerId from the request body
      image,
      date: new Date(), // Set the current date and time for the event
      status: 'pending' // Default status when creating an event
    });

    // Save the event to the database
    await event.save();
    res.status(201).json(event); // Send the created event in the response

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all events
exports.getAllEvents = async (req, res) => {
  try {
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

// controllers/eventController.js
exports.updateEvent = async (req, res) => {
  const { location, date, availableTickets } = req.body;

  try {
    // 🔐 Confirm user is authenticated and has a valid role
    if (!req.user || !req.user.userId || !["Organizer", "Admin"].includes(req.user.role)) {
      console.log("User not authorized or not logged in:", req.user);
      return res.status(403).json({ error: "You are not authorized to update events." });
    }

    // 🔍 Find event by ID
    const event = await Event.findById(req.params.id);
    if (!event) {
      console.log("Event not found with ID:", req.params.id);
      return res.status(404).json({ error: "Event not found" });
    }

    // 👮 Check Organizer access (only if not Admin)
    const isOrganizer = event.organizerId.toString() === req.user.userId.toString();
    if (req.user.role === "Organizer" && !isOrganizer) {
      console.log("Access denied: Organizer ID mismatch. Event:", event.organizerId.toString(), "User:", req.user.userId.toString());
      return res.status(403).json({ error: "You are not authorized to update this event" });
    }

    // ✏️ Update event fields
    event.location = location || event.location;
    event.date = date || event.date;
    event.availableTickets = availableTickets || event.availableTickets;

    // 💾 Save and return
    await event.save();
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

    // 🗑️ Delete the event
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
    res.status(400).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user.userId) {
      console.log("User object:", req.user); // Log the user object
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Find events organized by the authenticated user
    const events = await Event.find({ organizerId: req.user.userId });
    console.log("Events found:", events); // Log the events found

    if (!events.length) {
      return res.status(404).json({ error: "No events found for this organizer" });
    }

    // Calculate analytics for each event
    const analytics = events.map(event => {
      const percentageBooked = ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100;
      return { eventId: event._id, title: event.title, percentageBooked };
    });

    res.json(analytics);
  } catch (err) {
    console.error("Error fetching event analytics:", err); // Log the error
    res.status(500).json({ error: err.message });
  }
};