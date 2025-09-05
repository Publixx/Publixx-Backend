const db = require("../config/knex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp");
const { sendOtpEmail } = require("../utils/email");

class AuthService {
  async register(username, email, password) {
    if (!username || !email || !password) {
      throw new Error("username, email and password are required");
    }

    // check duplicates
    const existingUser = await db("users")
      .where({ username })
      .orWhere({ email })
      .first();
    if (existingUser) {
      throw new Error("username or email already taken");
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    // ✅ Try sending OTP first
    try {
      await sendOtpEmail(email, otp);
    } catch (err) {
      console.error("❌ Failed to send OTP email:", err.message);
      throw new Error("Could not send verification email. Please try again.");
    }

    // ✅ Only insert user if email sent successfully
    const [user] = await db("users")
      .insert({
        username,
        email,
        password: hashed,
        otp_code: otp,
        otp_expiry: expiry,
      })
      .returning(["id", "username", "email", "is_verified"]);

    return { message: "Signup successful. Please verify your email.", user };
  }

  async verifyEmail(email, otp) {
    const user = await db("users").where({ email }).first();
    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("Email already verified");

    if (user.otp_code !== otp || new Date() > user.otp_expiry) {
      throw new Error("Invalid or expired OTP");
    }

    await db("users")
      .where({ email })
      .update({
        is_verified: true,
        otp_code: null,
        otp_expiry: null,
      });

    return { message: "Email verified successfully" };
}



  async login(username, password) {
  const user = await db("users").where({ username }).first();
  if (!user) throw new Error("User not found");

  if (!user.is_verified) {
    throw new Error("Please verify your email before logging in.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user.id, username: user.username, email: user.email } };
}
}

module.exports = new AuthService();
