const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: Number,
  otpExpires: Date,
});

module.exports = mongoose.model("Admin", adminSchema);
