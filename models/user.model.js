const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // Renamed "profile picture" to "profilePicture"
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["Standard User", "Organizer","System Admin"] }
});

module.exports = mongoose.model("User", userSchema);
