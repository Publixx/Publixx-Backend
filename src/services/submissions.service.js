const db = require("../config/knex");
const s3 = require("./storage.s3.service");

class SubmissionsService {
  async create(userId, stage, file) {
    const uploaded = await s3.upload(file, `submissions/${userId}`);

    const [submission] = await db("submissions")
      .insert({
        user_id: userId,
        stage,
        photos: JSON.stringify([uploaded.url]),
        status: "pending"
      })
      .returning("*");

    return submission;
  }

  async findByUser(userId) {
    return db("submissions")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  }
}

module.exports = new SubmissionsService();
