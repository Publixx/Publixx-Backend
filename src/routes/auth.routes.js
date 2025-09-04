const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Option 1: arrow functions
router.post("/signup", (req, res) => authController.signup(req, res));
router.post("/login", (req, res) => authController.login(req, res));

// Option 2 (cleaner): bind
// router.post("/signup", authController.signup.bind(authController));
// router.post("/login", authController.login.bind(authController));

module.exports = router;
