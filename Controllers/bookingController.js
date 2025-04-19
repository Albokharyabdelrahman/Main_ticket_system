const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.bookTickets = async (req, res) => {
  const { eventId, ticketsBooked } = req.body;

  try {
    // Check if the user is authenticated
    if (!req.user || !req.user.userId) {
      console.log("User object:", req.user); // Log the user object
      return res.status(401).json({ error: "User not authenticated " });
    }

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
      userId: req.user.userId, // Use userId from the token
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
    console.error("Error during booking:", err); // Log the error
    res.status(400).json({ error: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅ Find a non-cancelled booking that belongs to the user
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      status: { $ne: "cancelled" }
    }).populate("eventId");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found/cancelled" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id; // 🔁 use req.params.id consistently

  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅ Ensure user role is 'User'
    if (req.user.role !== "User") {
      return res.status(403).json({ error: "Only users can cancel bookings" });
    }

    // ✅ Find active, uncancelled booking that belongs to the logged-in user
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.userId,
      status: { $ne: "cancelled" }
    });

    // 🔁 If not found, check if booking exists at all
    if (!booking) {
      const exists = await Booking.findById(bookingId);
      if (!exists) {
        return res.status(404).json({ error: "Booking not found" });
      } else {
        return res.status(403).json({ error: "You are not authorized to cancel this booking or it is already cancelled" });
      }
    }

    // ✅ Cancel the booking
    booking.status = "cancelled";
    await booking.save();

    // ✅ Update the related event
    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableTickets += booking.ticketsBooked;
      await event.save();
    }

    res.json({ message: "Booking cancelled successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};