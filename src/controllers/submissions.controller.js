const submissionsService = require("../services/submissions.service");

exports.createSubmission = async (req, res) => {
  try {
    const { stage } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const submission = await submissionsService.create(userId, stage, req.file);
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const submissions = await submissionsService.findByUser(userId);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
