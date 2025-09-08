const profileService = require("../services/profile.service");

class ProfileController {
  async createOrUpdateProfile(req, res) {
    try {
      const profile = await profileService.createOrUpdateProfile(req.user, req.body, req.file);
      console.log("=====================req.file",req.file);
  // console.log("req.body",req);
        
      res.status(201).json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await profileService.getProfile(req.user);
      res.status(200).json(profile);
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
