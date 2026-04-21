const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Organizer', 'User'],
      required: true
    },
    profilePicture: { type: String },
    birthdate: { type: Date },
    phone: { type: String },
    country: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Prefer not to mention'] },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true } 
  
);

module.exports = mongoose.model("User", userSchema);
