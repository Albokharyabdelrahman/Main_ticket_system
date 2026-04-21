const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const AuthorizationMiddleware = require("../Middleware/AuthorizationMiddleware");
const ticketController = require("../Controllers/ticketController");

const {
  getTicketById,
  getTicketsByBooking,
  cancelTicket,
} = ticketController;

// Get ticket details
router.get("/:id", AuthenticationMiddleware, getTicketById);

// Get all tickets for a booking
router.get("/booking/:bookingId", AuthenticationMiddleware, AuthorizationMiddleware("User"), getTicketsByBooking);

// Cancel a ticket from a booking
router.patch("/booking/:bookingId/cancel", AuthenticationMiddleware, AuthorizationMiddleware("User"), cancelTicket);

module.exports = router; 