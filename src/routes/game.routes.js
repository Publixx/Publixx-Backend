const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const GameController = require("../controllers/game.controller");

router.use(authMiddleware);

// Get current stage
router.get("/current", GameController.getCurrentStage);

// Get all stages with unlock status
router.get("/stages", GameController.getAvailableStages);

// Force unlock next stage (after approved submission)
router.post("/unlock", GameController.unlockNextStage);

module.exports = router;
