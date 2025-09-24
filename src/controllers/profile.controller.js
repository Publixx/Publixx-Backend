const profileService = require("../services/profile.service");

class ProfileController {
  async createOrUpdateProfile(req, res) {
    try {
      console.log("DEBUG createOrUpdateProfile req.user:", req.user);
      const user = req.user; // from authMiddleware
      const file = req.file; // multer file
      const { bio } = req.body;

      const profile = await profileService.createOrUpdateProfile(user, file, bio);
      return res.status(200).json(profile);
    } catch (err) {
      console.error("Profile creation failed:", err && err.message ? err.message : err);
      return res.status(400).json({ error: err.message || "Profile creation failed" });
    }
  }

  async getMyProfile(req, res) {
    try {
      const profile = await profileService.getProfile(req.user);
      console.log("profile", profile);
      
      res.json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getPublicProfile(req, res) {
    try {
      const { username } = req.params;
      const profile = await profileService.getPublicProfile(username);
      if (!profile) return res.status(404).json({ error: "Profile not found" });
      res.json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new ProfileController();
