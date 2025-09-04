const authService = require("../services/auth.service");

class AuthController {
  async signup(req, res) {
    try {
      const { codename, password } = req.body;

      if (!codename || !password) {
        return res.status(400).json({ error: "Codename and password are required" });
      }

      const result = await authService.register(codename, password);

      res.status(201).json(result);
    } catch (error) {
      console.error("Signup Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { codename, password } = req.body;

      if (!codename || !password) {
        return res.status(400).json({ error: "Codename and password are required" });
      }

      const result = await authService.login(codename, password);

      res.status(200).json(result);
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
