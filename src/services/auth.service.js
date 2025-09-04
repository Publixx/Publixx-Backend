const db = require("../config/knex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async register(codename, password) {
  // 0. Validate codename
  if (!codename) {
    throw new Error("Codename is required");
  }
  if (/\s/.test(codename)) {
    throw new Error("Codename cannot contain spaces");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(codename)) {
    throw new Error("Codename can only contain letters, numbers, and underscores");
  }

  // 1. Check if codename exists
  const existingUser = await db("users").where({ codename }).first();
  if (existingUser) {
    throw new Error("Codename already taken");
  }

  // 2. Hash password
  const hashed = await bcrypt.hash(password, 10);

  // 3. Insert new user
  const [user] = await db("users")
    .insert({ codename, password: hashed })
    .returning(["id", "codename"]);

  // ✅ Do not generate token here
  return { user, message: "Signup successful. Please login to continue." };
}



  async login(codename, password) {
    // 1. Find user
    const user = await db("users").where({ codename }).first();
    if (!user) throw new Error("User not found");

    // 2. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    // 3. Create token
    const token = jwt.sign(
      { id: user.id, codename: user.codename },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, user: { id: user.id, codename: user.codename } };
  }
}

module.exports = new AuthService();
