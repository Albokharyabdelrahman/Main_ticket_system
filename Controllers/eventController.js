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

// Update event (only organizers can update their events)
exports.updateEvent = async (req, res) => {
  const { location, date, availableTickets } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure the user is the organizer of the event
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
    }

    event.location = location || event.location;
    event.date = date || event.date;
    event.availableTickets = availableTickets || event.availableTickets;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event (only organizers can delete their events)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure the user is the organizer of the event
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this event" });
    }

    await event.remove();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

// Get event analytics (only organizers can view their own events)
exports.getAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });
    if (!events.length) {
      return res.status(404).json({ error: "No events found for this organizer" });
    }

    const analytics = events.map(event => {
      const percentageBooked = ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100;
      return { eventId: event._id, title: event.title, percentageBooked };
    });

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
