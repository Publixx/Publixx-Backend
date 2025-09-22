const GameService = require("../services/game.service");

class GameController {
  async getCurrentStage(req, res) {
    try {
      const currentStage = await GameService.getCurrentStage(req.user.id);
      res.json({ current_stage: currentStage });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAvailableStages(req, res) {
    try {
      const stages = await GameService.getAvailableStages(req.user.id);
      res.json(stages);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async unlockNextStage(req, res) {
    try {
      const nextStage = await GameService.tryUnlockNextStage(req.user.id);
      res.json({ unlocked_stage: nextStage });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new GameController();
