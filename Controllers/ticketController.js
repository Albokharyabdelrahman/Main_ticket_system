const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Get a single ticket by ID, including event image and booking info
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({ path: 'event', select: 'title date location image price' })
      .populate({ path: 'booking' });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tickets for a specific booking
exports.getTicketsByBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅ Find the booking to verify ownership
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or not authorized" });
    }

    // ✅ Get all tickets for this booking
    const tickets = await Ticket.find({ booking: bookingId })
      .populate({ path: 'event', select: 'title date location image price' })
      .sort({ issuedAt: 1 });

    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: err.message });
  }
};

// Cancel/delete a ticket
exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.body;
  const { bookingId } = req.params;

  try {
    // ✅ Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // ✅ Ensure user role is 'User'
    if (req.user.role !== "User") {
      return res.status(403).json({ error: "Only users can cancel tickets" });
    }

    // ✅ Find the booking to verify ownership
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.userId,
      status: { $ne: "cancelled" }
    });

    if (!booking) {
      const exists = await Booking.findById(bookingId);
      if (!exists) {
        return res.status(404).json({ error: "Booking not found" });
      } else {
        return res.status(403).json({ error: "You are not authorized to cancel tickets from this booking or it is already cancelled" });
      }
    }

    // ✅ Find the ticket to be cancelled
    const ticket = await Ticket.findOne({
      _id: ticketId,
      booking: bookingId,
      status: 'valid'
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found or already cancelled" });
    }

    // ✅ Check if this is the last ticket in the booking
    const activeTickets = await Ticket.countDocuments({
      booking: bookingId,
      status: 'valid'
    });

    if (activeTickets === 1) {
      // Cancel the entire booking if it's the last ticket
      booking.status = "cancelled";
      await booking.save();

      // Delete the ticket
      await Ticket.findByIdAndDelete(ticketId);

      // Update the related event
      const event = await Event.findById(booking.eventId);
      if (event) {
        event.availableTickets += 1;
        await event.save();
      }

      return res.json({ 
        message: "Last ticket cancelled - entire booking cancelled successfully",
        bookingCancelled: true
      });
    } else {
      // Delete the specific ticket
      await Ticket.findByIdAndDelete(ticketId);

      // Update the booking
      booking.ticketsBooked -= 1;
      booking.totalPrice = (booking.totalPrice / (booking.ticketsBooked + 1)) * booking.ticketsBooked;
      await booking.save();

      // Update the related event
      const event = await Event.findById(booking.eventId);
      if (event) {
        event.availableTickets += 1;
        await event.save();
      }

      return res.json({ 
        message: "Ticket cancelled successfully",
        bookingCancelled: false,
        remainingTickets: booking.ticketsBooked
      });
    }

  } catch (err) {
    console.error("Error cancelling ticket:", err);
    res.status(400).json({ error: err.message });
  }
}; 