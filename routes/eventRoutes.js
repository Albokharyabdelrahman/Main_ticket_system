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
  getApprovedEvents
} = require("../Controllers/eventController");

// PUBLIC ROUTES
router.get("/", getApprovedEvents);               // Get list of all events
router.get("/all", authenticationMiddleware, authorizeRoles("Admin"), getAllEvents);
router.get("/:id", getEventById);                   // Get details of a single eventg

// PRIVATE ROUTES (Organizer)
router.post("/", authenticationMiddleware, authorizeRoles("Organizer"), createEvent); // Create a new event
router.put("/:id", authenticationMiddleware, authorizeRoles(["Organizer", "Admin"]), updateEvent); // Update an event
router.delete("/:id", authenticationMiddleware, authorizeRoles(["Organizer", "Admin"]), deleteEvent); // Delete an event
module.exports = router;