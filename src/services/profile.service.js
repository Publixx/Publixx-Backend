const db = require("../config/knex");
const { uploadMaskedPhoto, deleteMaskedPhoto } = require("./storage.s3.service");

class ProfileService {
  async createOrUpdateProfile(user, file, bio) {
    if (!user || !user.id) {
      throw new Error("Invalid user. Make sure you are authenticated.");
    }

    const userId = user.id;

    // Always fetch full user record to ensure username exists
    const dbUser = await db("users").where({ id: userId }).first();
    if (!dbUser) throw new Error("User not found in database.");

    let photoUrl = null;

    const existingProfile = await db("profiles").where({ user_id: userId }).first();

    if (file) {
      if (existingProfile && existingProfile.masked_photo_url) {
        try {
          await deleteMaskedPhoto(existingProfile.masked_photo_url);
        } catch (err) {
          console.error("❌ Failed to delete old image from S3:", err.message);
        }
      }

      photoUrl = await uploadMaskedPhoto(file, userId);
    } else if (existingProfile) {
      photoUrl = existingProfile.masked_photo_url;
    }

    // ✅ Use dbUser.username instead of user.username
    const [profile] = await db("profiles")
      .insert({
        user_id: userId,
        username: dbUser.username, // always safe
        bio,
        masked_photo_url: photoUrl,
      })
      .onConflict("user_id")
      .merge()
      .returning(["username", "bio", "masked_photo_url"]);

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
      .select("username", "bio", "masked_photo_url")
      .where({ user_id: user.id })
      .first();

    if (!profile) return null;

    return {
      user_id: user.id,
      username: profile.username,
      bio: profile.bio,
      masked_photo_url: profile.masked_photo_url,
    };
  }

  async getPublicProfile(username) {
    // ✅ No need to query users first
    const profile = await db("profiles")
      .select("username", "bio", "masked_photo_url")
      .whereRaw("LOWER(username) = ?", [username.toLowerCase()])
      .first();

    return profile || null;
  }
}

module.exports = new ProfileService();
