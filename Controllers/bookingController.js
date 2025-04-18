const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Book tickets for an event
exports.bookTickets = async (req, res) => {
  const { eventId, ticketsBooked } = req.body;

  try {
    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if there are enough tickets available
    if (event.availableTickets < ticketsBooked) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // Calculate total price based on ticket quantity and event price
    const totalPrice = event.price * ticketsBooked;

    // Create a new booking
    const booking = new Booking({
      userId: req.user._id,
      eventId: eventId,
      ticketsBooked: ticketsBooked,
      totalPrice: totalPrice,
      bookingDate: new Date(),
      status: "pending", // Default status when booking
    });

    // Save the booking
    await booking.save();

    // Update the event's available tickets
    event.availableTickets -= ticketsBooked;
    await event.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a booking by ID (added the missing function)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("eventId");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Ensure the booking belongs to the authenticated user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to cancel this booking" });
    }

    // Change the status to "cancelled"
    booking.status = "cancelled";
    await booking.save();

    // Update the event's available tickets
    const event = await Event.findById(booking.eventId);
    event.availableTickets += booking.ticketsBooked;
    await event.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
