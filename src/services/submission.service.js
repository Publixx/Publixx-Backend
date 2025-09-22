const db = require("../config/knex");
const { uploadSubmission } = require("./storage.s3.service");

class SubmissionService {
  async createSubmission(user, files, stage) {
    if (!user || !user.id) throw new Error("Authenticated user required");
    if (!stage) throw new Error("Stage is required");

    const userId = user.id;

    // Upload photos
    let photoUrls = [];
    if (files.photos && files.photos.length > 0) {
      photoUrls = await Promise.all(
        files.photos.map((file) => uploadSubmission(file, stage, userId))
      );
    }

    // Upload video
    let videoUrl = null;
    if (files.video) {
      videoUrl = await uploadSubmission(files.video, stage, userId);
    }

    // ✅ Store photos as JSON string, cast to JSONB
    const [submission] = await db("submissions")
      .insert({
        user_id: userId,
        stage: parseInt(stage, 10),
        photos: db.raw("?::jsonb", [JSON.stringify(photoUrls)]), // 👈 FIX
        video_url: videoUrl,
        status: "pending",
      })
      .returning(["id", "stage", "photos", "video_url", "status", "created_at"]);

    return {
      ...submission,
      photos: submission.photos || [],
    };
  }

  async getUserSubmissions(user) {
    const rows = await db("submissions")
      .where({ user_id: user.id })
      .orderBy("created_at", "desc");

    return rows.map((r) => ({
      ...r,
      photos: r.photos || [],
    }));
  }

  async getStageSubmissions(stage) {
    const rows = await db("submissions")
      .where({ stage })
      .orderBy("created_at", "desc");

    return rows.map((r) => ({
      ...r,
      photos: r.photos || [],
    }));
  }
}

module.exports = new SubmissionService();
