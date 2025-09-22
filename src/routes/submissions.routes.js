const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");
const SubmissionController = require("../controllers/submission.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create submission (upload photos/videos)
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  (req, res) => SubmissionController.createSubmission(req, res)
);

// Get submissions for the logged-in user
router.get("/me", authMiddleware, (req, res) =>
  SubmissionController.getUserSubmissions(req, res)
);

// Get submissions for a specific stage
router.get("/stage/:stage", authMiddleware, (req, res) =>
  SubmissionController.getStageSubmissions(req, res)
);

module.exports = router;
