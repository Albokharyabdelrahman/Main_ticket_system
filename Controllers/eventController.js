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