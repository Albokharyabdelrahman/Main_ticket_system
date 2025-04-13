const express = require("express");
const router = express.Router();
const AuthenticationMiddleware = require("../Middleware/AuthenticationMiddleware");
const AuthorizationMiddleware = require("../Middleware/AuthorizationMiddleware");
const {
  getAllUsers,
  getProfile,
  updateProfile,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserEventAnalytics,
} = require("../controllers/userController");

// ✅ Specific routes first (static paths)
router.get("/profile", AuthenticationMiddleware, getProfile);
router.put("/profile", AuthenticationMiddleware, updateProfile);
router.get("/bookings", AuthenticationMiddleware, AuthorizationMiddleware("User"), getUserBookings);
router.get("/events", AuthenticationMiddleware, AuthorizationMiddleware("Organizer"), getUserEvents);
router.get("/events/analytics", AuthenticationMiddleware, AuthorizationMiddleware("Organizer"), getUserEventAnalytics);

// ✅ Then general routes
router.get("/", AuthenticationMiddleware, AuthorizationMiddleware("Admin"), getAllUsers);
router.get("/:id", AuthenticationMiddleware, AuthorizationMiddleware("Admin"), getUserById);
router.put("/:id", AuthenticationMiddleware, AuthorizationMiddleware("Admin"), updateUserRole);
router.delete("/:id", AuthenticationMiddleware, AuthorizationMiddleware("Admin"), deleteUser);

module.exports = router;
