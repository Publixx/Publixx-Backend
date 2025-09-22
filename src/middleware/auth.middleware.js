const jwt = require("jsonwebtoken");
const db = require("../config/knex");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token already has id, use it
    if (decoded.id) {
      req.user = {
        id: decoded.id,
        username: decoded.username || null,
        email: decoded.email || null,
      };
      return next();
    }

    // Fallback: look up by username or email
    let user;
    if (decoded.username) {
      user = await db("users")
        .whereRaw("LOWER(username) = ?", [decoded.username.toLowerCase()])
        .first();
    } else if (decoded.email) {
      user = await db("users").where({ email: decoded.email }).first();
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid token: user not found" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
