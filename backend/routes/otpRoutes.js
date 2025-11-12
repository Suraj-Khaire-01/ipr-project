// ✅ Twilio 2FA Routes
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP to admin phone number
app.post("/api/send-admin-otp", async (req, res) => {
  const { phone } = req.body; // e.g. "+919876543210"

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Twilio send error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP code
app.post("/api/verify-admin-otp", async (req, res) => {
  const { phone, code } = req.body;

  try {
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === "approved") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("❌ Twilio verify error:", error);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
});
