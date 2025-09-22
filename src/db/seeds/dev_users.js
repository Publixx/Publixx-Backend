// src/db/seeds/dev_users.js
const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();

  const hashed = await bcrypt.hash("password123", 10);

  await knex("users").insert([
    {
      username: "testuser",
      password: hashed,
      email: "test@example.com",
      is_verified: true
    }
  ]);
};
