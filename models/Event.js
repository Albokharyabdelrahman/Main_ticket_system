const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availableTickets: {
    type: Number,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  maxTicketsPerPerson: {
    type: Number,
    required: true,
    default: 10, // Default maximum of 10 tickets per person
    min: 1, // Minimum 1 ticket per person
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false, // Optional thumbnail for better performance
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'declined'],
    default: 'pending',
  }
}, { timestamps: true }); 

module.exports = mongoose.model("Event", eventSchema);
