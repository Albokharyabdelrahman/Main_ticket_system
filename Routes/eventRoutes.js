const express = require("express");
const router = express.Router();

// Import middlewares (note: renamed to match your filenames)
const authenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const authorizeRoles = require("../Middleware/AuthorizationMiddleware");

// Import controller functions
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAnalytics // Renamed the analytics function
} = require("../Controllers/eventController");

// PUBLIC ROUTES
router.get("/", getAllEvents);                     // Get list of all events
router.get("/organizer/analytics", authenticationMiddleware, authorizeRoles("Organizer"), getAnalytics); // Analytics for organizer's events
router.get("/:id", getEventById);                   // Get details of a single event

// PRIVATE ROUTES (Organizer)
router.post("/", authenticationMiddleware, authorizeRoles("Organizer"), createEvent); // Create a new event
router.put("/:id", authenticationMiddleware, authorizeRoles("Organizer", "Admin"), updateEvent); // Update an event
router.delete("/:id", authenticationMiddleware, authorizeRoles("Organizer", "Admin"), deleteEvent); // Delete an event

module.exports = router;
