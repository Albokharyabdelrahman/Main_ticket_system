const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  ticketNumber: { type: String, required: true, unique: true },
  qrCodeData: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'valid' }
});

module.exports = mongoose.model('Ticket', TicketSchema); 