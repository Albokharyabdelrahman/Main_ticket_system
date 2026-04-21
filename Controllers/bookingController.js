const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { sendVerificationEmail } = require("../Utils/sendEmail");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Helper to generate QR code as buffer
async function generateQRCode(data) {
  return await QRCode.toBuffer(data, { type: 'png' });
}

// Helper to generate ticket PDF as buffer
async function generateTicketPDF({ event, user, ticket, logoPath }) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Colors and fonts
      const accent = '#7c3aed'; // BookedIn purple
      const lightAccent = '#ede9fe';
      const dark = '#22223b';
      const gray = '#6c6a7e';
      const borderRadius = 12;
      const font = 'Helvetica';

      // Header: BookedIn logo and branding
      doc.image(logoPath, 40, 32, { width: 54 });
      doc.font(font).fontSize(28).fillColor(accent).text('BookedIn', 104, 38, { continued: false });

      // Event title
      doc.moveDown(1.2);
      doc.font(font).fontSize(22).fillColor(dark).text(event.title, 40, 90, { align: 'left', continued: false });
      // Date, time, location
      doc.font(font).fontSize(13).fillColor(gray).text(
        `${new Date(event.date).toLocaleString()}\n${event.location}`,
        40, 120
      );

      // Ticket info box
      const boxY = 160;
      doc.roundedRect(40, boxY, 500, 100, borderRadius).fillAndStroke(lightAccent, accent);
      doc.font(font).fontSize(13).fillColor(dark).text(
        `Ticket type: General Admission\nPrice: $${event.price}\nOrdered by: ${user.name || user.email}\nStatus: Paid`,
        56, boxY + 16
      );
      // QR code
      const qrBuffer = await generateQRCode(ticket._id.toString());
      doc.image(qrBuffer, 440, boxY + 18, { width: 60, height: 60 });

      // Order details
      doc.font(font).fontSize(11).fillColor(gray).text(
        `Order no.: ${ticket.booking}\nOrder date: ${ticket.issuedAt.toLocaleDateString()}\nTicket no.: ${ticket._id}`,
        40, boxY + 120
      );

      // Info text
      doc.font(font).fontSize(10.5).fillColor(gray).text(
        'This is your event ticket. Ticket holders must present their tickets on entry. You can print or present this digital version. For questions or refunds, contact the event host.',
        40, boxY + 160, { width: 500 }
      );

      // Event image as a wide banner with rounded corners at the bottom
      if (event.image) {
        try {
          const imgWidth = 530;
          const imgHeight = 270;
          const imgX = ((doc.page.width - imgWidth) / 2)-2.5; // Use actual page width for perfect centering
          const imgY = 510;
          // No rounded corners, just draw the image as a rectangle
          const imageBuffer = Buffer.from(event.image, 'base64');
          doc.image(imageBuffer, imgX, imgY, { width: imgWidth, height: imgHeight });
        } catch (e) { /* ignore image errors */ }
      }

      doc.rect(30, 20, 530, 760).stroke('#bbb'); // outer border for a clean look
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

exports.bookTickets = async (req, res) => {
  const { eventId, ticketsBooked } = req.body;

  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated " });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.availableTickets < ticketsBooked) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }
    if (ticketsBooked > event.maxTicketsPerPerson) {
      return res.status(400).json({ 
        error: `Maximum ${event.maxTicketsPerPerson} tickets allowed per person for this event` 
      });
    }
    const existingBookings = await Booking.find({
      userId: req.user.userId,
      eventId: eventId,
      status: { $ne: "cancelled" }
    });
    const totalAlreadyBooked = existingBookings.reduce((sum, booking) => sum + booking.ticketsBooked, 0);
    const totalAfterBooking = totalAlreadyBooked + ticketsBooked;
    if (totalAfterBooking > event.maxTicketsPerPerson) {
      return res.status(400).json({ 
        error: `You have already booked ${totalAlreadyBooked} tickets for this event. Maximum ${event.maxTicketsPerPerson} tickets allowed per person.` 
      });
    }
    const totalPrice = event.price * ticketsBooked;
    const booking = new Booking({
      userId: req.user.userId,
      eventId: eventId,
      ticketsBooked: ticketsBooked,
      totalPrice: totalPrice,
      bookingDate: new Date(),
      status: "confirmed",
    });
    await booking.save();
    event.availableTickets -= ticketsBooked;
    await event.save();

    // --- Ticket creation, PDF, and email logic ---
    const user = await User.findById(req.user.userId);
    const logoPath = path.join(__dirname, '../vite-project/src/assets/logo.png');
    const tickets = [];
    const pdfBuffers = [];
    for (let i = 0; i < ticketsBooked; i++) {
      const ticket = new Ticket({
        event: event._id,
        user: user._id,
        booking: booking._id,
        issuedAt: new Date(),
        status: 'valid'
      });
      ticket.ticketNumber = ticket._id.toString();
      ticket.qrCodeData = ticket._id.toString();
      await ticket.save();
      tickets.push(ticket);
      const pdfBuffer = await generateTicketPDF({ event, user, ticket, logoPath });
      pdfBuffers.push({ filename: `ticket-${ticket._id}.pdf`, content: pdfBuffer });
    }
    // Send email with all ticket PDFs attached
    await sendVerificationEmail(
      user.email,
      `Your BookedIn Tickets for ${event.title}`,
      `<p>Thank you for your booking! Your tickets are attached as PDFs. Please present them at the event.</p>`,
      pdfBuffers
    );
    res.status(201).json({ booking, tickets });
  } catch (err) {
    console.error("Error during booking:", err);
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



// Get the top 3 most booked events in the last 2 weeks
exports.getTopTrendingEventsLast2Weeks = async (req, res) => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Aggregate bookings in the last 2 weeks, group by event, sum tickets
    const result = await Booking.aggregate([
      { $match: { bookingDate: { $gte: twoWeeksAgo }, status: { $ne: "cancelled" } } },
      { $group: { _id: "$eventId", totalTickets: { $sum: "$ticketsBooked" } } },
      { $sort: { totalTickets: -1 } },
      { $limit: 3 },
    ]);

    if (!result.length) {
      return res.status(404).json({ error: "No bookings found in the last 2 weeks." });
    }

    // Populate event details for each
    const events = await Promise.all(result.map(async (r) => {
      const event = await Event.findById(r._id);
      if (!event) return null;
      return {
        _id: event._id,
        name: event.title,
        image: event.image,
        date: event.date,
        location: event.location,
        totalTickets: r.totalTickets,
      };
    }));

    res.json({
      events: events.filter(Boolean)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
