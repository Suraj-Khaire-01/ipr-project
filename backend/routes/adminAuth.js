// adminAuth.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Step 1 successful: Send OTP to email (handled next)
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    admin.otp = otp;
    admin.otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 min
    await admin.save();

    // Send OTP via email
    sendEmail(admin.email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// adminAuth.js (continued)
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > admin.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
