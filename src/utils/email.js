// This file contains utility functions related to sending OTP emails.ß
const transporter = require("../config/mailer");


async function sendOtpEmail(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"Publixx" <${process.env.EMAIL_FROM}>`, // ✅ Verified sender
      to, // recipient
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    })
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error sending OTP email:", error);
  }  
  
}

module.exports = { sendOtpEmail };
