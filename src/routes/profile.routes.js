const express = require("express");
const multer = require("multer");
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  (req, res) => profileController.createOrUpdateProfile(req, res)
);

router.get("/me", authMiddleware, (req, res) =>
  profileController.getMyProfile(req, res)
);

router.get("/:username", (req, res) =>
  profileController.getPublicProfile(req, res)
);

module.exports = router;
