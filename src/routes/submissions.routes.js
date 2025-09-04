const express = require("express");
const multer = require("multer");
const { createSubmission, getUserSubmissions } = require("../controllers/submissions.controller");
const auth = require("../middleware/auth.middleware");

const router = express.Router();
const upload = multer({ dest: "/tmp" });

router.post("/", auth, upload.single("photo"), createSubmission);
router.get("/", auth, getUserSubmissions);

module.exports = router;
