const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const authMiddleware = require("../middleware/auth.middleware");
const profileController = require("../controllers/profile.controller");

// Private (requires JWT)
router.post("/", authMiddleware, upload.single("photo"), (req, res) =>
  profileController.createOrUpdateProfile(req, res)
);

router.get("/", authMiddleware, (req, res) =>
  profileController.getProfile(req, res)
);

// Public (no JWT)
router.get("/:username", (req, res) =>
  profileController.getPublicProfile(req, res)
);

module.exports = router;
