const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  profilePicture: String,
  birthdate: Date,
  phone: String,
  country: String,
  gender: { type: String, enum: ['Male', 'Female', 'Prefer not to mention'] },
  verificationToken: String,
  otp: String,
  otpExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingUser', PendingUserSchema); 