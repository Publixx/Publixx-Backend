// This file contains utility functions related to sending OTP emails.ß
const transporter = require("../config/mailer");


async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Publixx" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email - Publixx",
    text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 15 minutes.</p>`,
  });
}

module.exports = { sendOtpEmail };
