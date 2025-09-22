const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const submissionsRoutes = require("./routes/submissions.routes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profile.routes");
const gameRoutes = require("./routes/game.routes");

// const votesRoutes = require("./routes/votes.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/submissions", submissionsRoutes);

// app.use("/api/votes", votesRoutes);

module.exports = app;
