// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "IPR Management System <no-reply@ipr-system.com>",
    to: email,
    subject: "Your Admin Login OTP",
    text: `Your OTP for Admin login is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
