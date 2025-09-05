const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Signup (sends OTP to email)
router.post("/signup", (req, res) => authController.signup(req, res));

// Verify email (enter OTP)
router.post("/verify-email", (req, res) => authController.verifyEmail(req, res));

// Resend OTP
router.post("/resend-otp", (req, res) => authController.resendOtp(req, res));

// Login (only works after verification)
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
