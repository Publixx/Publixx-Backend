const SubmissionService = require("../services/submission.service");

class SubmissionController {
  async createSubmission(req, res) {
    try {
      const { stage } = req.body;
      if (!stage) {
        return res.status(400).json({ error: "Stage is required" });
      }

      const files = {
        photos: req.files?.photos || [],
        video: req.files?.video ? req.files.video[0] : null,
      };

      const submission = await SubmissionService.createSubmission(
        req.user,
        files,
        stage
      );

      return res.json(submission);
    } catch (err) {
      console.error("❌ createSubmission error:", err.message);
      return res.status(400).json({ error: err.message });
    }
  }

  async getUserSubmissions(req, res) {
    try {
      const submissions = await SubmissionService.getUserSubmissions(req.user);
      return res.json(submissions);
    } catch (err) {
      console.error("❌ getUserSubmissions error:", err.message);
      return res.status(400).json({ error: err.message });
    }
  }

  async getStageSubmissions(req, res) {
    try {
      const { stage } = req.params;
      const submissions = await SubmissionService.getStageSubmissions(stage);
      return res.json(submissions);
    } catch (err) {
      console.error("❌ getStageSubmissions error:", err.message);
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new SubmissionController();
