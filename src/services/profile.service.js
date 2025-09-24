const db = require("../config/knex");
const { uploadMaskedPhoto, deleteMaskedPhoto } = require("./storage.s3.service");

class ProfileService {
  /**
   * user: object from req.user (must contain id)
   * file: multer file
   * bio: string
   */
  async createOrUpdateProfile(user, file, bio) {
    if (!user || !user.id) {
      throw new Error("Invalid user. Make sure you are authenticated.");
    }

    const userId = user.id;

    const dbUser = await db("users").where({ id: userId }).first();
    if (!dbUser) throw new Error("User not found in database.");

    let photoUrl = null;

    // Fetch existing profile (if any)
    const existingProfile = await db("profiles").where({ user_id: userId }).first();

    if (file) {
      // Delete old image from S3 if exists
      if (existingProfile && existingProfile.masked_photo_url) {
        try {
          await deleteMaskedPhoto(existingProfile.masked_photo_url);
        } catch (err) {
          console.error("❌ Failed to delete old image from S3:", err.message);
        }
      }

      // Upload new image
      photoUrl = await uploadMaskedPhoto(file, userId);
    } else if (existingProfile) {
      // keep existing photo if no new file
      photoUrl = existingProfile.masked_photo_url;
    }

    // Insert or update profile
    const [profile] = await db("profiles")
      .insert({
        user_id: userId,
        username: user.username,
        bio,
        masked_photo_url: photoUrl,
      })
      .onConflict("user_id")
      .merge()
      .returning(["bio", "masked_photo_url"]);

    return {
      username: dbUser.username,
      bio: profile ? profile.bio : null,
      masked_photo_url: profile ? profile.masked_photo_url : null,
      created_at: dbUser.created_at,
    };
  }

  async getProfile(user) {
    if (!user || !user.id) return null;
    
    const profile = await db("profiles")
      .select("username","bio", "masked_photo_url")
      .where({ user_id: user.id })
      .first();

    if (!profile) return null;

    return {
      username: user.username,
      user_id: user.id,
      ...profile,
    };
  }

  async getPublicProfile(username) {
    const user = await db("users").select("id", "username").whereRaw("LOWER(username) = ?", [username.toLowerCase()]).first();
    if (!user) return null;

    const profile = await db("profiles")
      .select("bio", "masked_photo_url")
      .where({ user_id: user.id })
      .first();

    if (!profile) return null;

    return {
      username: user.username,
      ...profile,
    };
  }
}

module.exports = new ProfileService();
