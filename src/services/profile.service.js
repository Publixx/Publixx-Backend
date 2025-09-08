const db = require("../config/knex");
const { uploadMaskedPhoto } = require("./storage.s3.service");

class ProfileService {
  async createOrUpdateProfile(user, { bio }, file) {
    let photoUrl = null;
   
    if (file) {
      photoUrl = await uploadMaskedPhoto(file,user.id);
    }

    const userId = user.id;
    const username = user.username;

    const existingProfile = await db("profiles").where({ user_id: userId }).first();
    let profile;

    if (existingProfile) {
      [profile] = await db("profiles")
        .where({ user_id: userId })
        .update(
          {
            bio,
            masked_photo_url: photoUrl || existingProfile.masked_photo_url,
            updated_at: new Date(),
          },
          ["bio", "masked_photo_url"]
        );
    } else {
      [profile] = await db("profiles")
        .insert({
          user_id: userId,
          bio,
          masked_photo_url: photoUrl,
        })
        .returning(["bio", "masked_photo_url"]);
    }

    return {
      username,
      ...profile,
      message: `Profile created/updated successfully ${Date.now()}`,
    };
  }

  async getProfile(user) {
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
