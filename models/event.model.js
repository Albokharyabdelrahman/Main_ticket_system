const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Title" key corrected
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  availableTickets: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String }, // Renamed "Image" to "image"
  Date:{type: Date}
});

module.exports = mongoose.model("Event", eventSchema);
