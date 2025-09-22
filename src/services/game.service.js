const db = require("../config/knex");

class GameService {
  /**
   * Get current stage of a user
   */
  async getCurrentStage(userId) {
    const user = await db("users").select("current_stage").where({ id: userId }).first();

    // Default new users start at stage 1
    return user?.current_stage || 1;
  }

  /**
   * Unlock the next stage if the user has at least one approved submission
   */
  async tryUnlockNextStage(userId) {
    const currentStage = await this.getCurrentStage(userId);

    // Check if user already at final stage
    if (currentStage >= 5) return currentStage;

    // Check if user has approved submission in current stage
    const approved = await db("submissions")
      .where({ user_id: userId, stage_id: currentStage, status: "approved" })
      .first();

    if (!approved) {
      throw new Error("You must have at least one approved submission to unlock the next stage.");
    }

    // Unlock next stage
    const nextStage = currentStage + 1;
    await db("users").where({ id: userId }).update({ current_stage: nextStage });

    return nextStage;
  }

  /**
   * Get available stages for a user (locked/unlocked info)
   */
  async getAvailableStages(userId) {
    const currentStage = await this.getCurrentStage(userId);

    return Array.from({ length: 5 }, (_, i) => ({
      stage_id: i + 1,
      unlocked: i + 1 <= currentStage,
    }));
  }
}

module.exports = new GameService();
