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
    profilePicture: { type: String, 
       otp: {
      code: String,
      expiresAt: Date
    },
    otpVerified: {
      type: Boolean,
      default: false
    }}
  },
  { timestamps: true } // ⏱️ Automatically adds createdAt and updatedAt
  
);



module.exports = mongoose.model("User", userSchema);
