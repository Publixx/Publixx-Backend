const db = require("../config/knex");
const { uploadMaskedPhoto } = require("./storage.s3.service");

class ProfileService {
  /**
   * user: object from req.user (must contain id)
   * file: multer file
   * bio: string
   */
  async createOrUpdateProfile(user, file, bio) {
    // Validate user object and id presence
    if (!user || !user.id) {
      throw new Error("Invalid user. Make sure you are authenticated.");
    }

    const userId = user.id;

    // Confirm that the user exists in DB (prevents FK violation)
    const dbUser = await db("users").where({ id: userId }).first();
    console.log("dbuser", dbUser);
    
    if (!dbUser) {
      throw new Error("User not found in database.");
    }

    let photoUrl = null;

    if (file) {
      // Upload masked profile photo (no mask detection here — as requested)
      photoUrl = await uploadMaskedPhoto(file, userId);
    }

    // Insert or update profile (onConflict ensures only one profile per user)
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
