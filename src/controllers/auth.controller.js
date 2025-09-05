const authService = require("../services/auth.service");

class AuthController {
  async signup(req, res) {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register(username, email, password);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyEmail(email, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

  async login(req, res) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (err) {
    if (err.message.includes("verify your email")) {
      // Unverified email → Unauthorized
      return res.status(401).json({ error: err.message });
    }
    if (err.message.includes("Invalid password") || err.message.includes("User not found")) {
      // Invalid credentials → Unauthorized
      return res.status(401).json({ error: err.message });
    }
    // Other errors → Bad request
    res.status(400).json({ error: err.message });
  }
}

}

module.exports = new AuthController();
