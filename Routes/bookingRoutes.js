const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const AuthorizationMiddleware = require("../Middleware/AuthorizationMiddleware");
const bookingController = require("../Controllers/bookingController");

const {
  bookTickets,
  getBookingById,
  cancelBooking,
  getTopTrendingEventsLast2Weeks,
} = bookingController;

router.get("/trending-events-2weeks", AuthenticationMiddleware, getTopTrendingEventsLast2Weeks);

router.post("/", AuthenticationMiddleware, AuthorizationMiddleware("User"), bookTickets);
router.get("/:id", AuthenticationMiddleware, AuthorizationMiddleware("User"), getBookingById);
router.delete("/:id", AuthenticationMiddleware, AuthorizationMiddleware("User"), cancelBooking);

module.exports = router;
