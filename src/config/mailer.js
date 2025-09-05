const nodemailer = require("nodemailer");
console.log("SMTP CONFIG:", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
// This file configures the mailer (Nodemailer) for sending emails like OTPs.