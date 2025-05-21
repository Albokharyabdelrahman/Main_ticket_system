const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import middlewares (note: renamed to match your filenames)
const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const AuthorizationMiddleware = require("../Middleware/AuthorizationMiddleware");

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
router.get("/all", AuthenticationMiddleware, AuthorizationMiddleware("Admin"), getAllEvents);
router.get("/:id", getEventById);                   // Get details of a single eventg

// PRIVATE ROUTES (Organizer)
router.post("/", AuthenticationMiddleware,upload.single('image'), AuthorizationMiddleware("Organizer"), createEvent); // Create a new event
router.put("/:id", AuthenticationMiddleware, AuthorizationMiddleware(["Organizer", "Admin"]), updateEvent); // Update an event
router.delete("/:id", AuthenticationMiddleware, AuthorizationMiddleware(["Organizer", "Admin"]), deleteEvent); // Delete an event
module.exports = router;