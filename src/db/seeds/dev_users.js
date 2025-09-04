exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert([
    { codename: "testuser", password: "hashedpassword" },
  ]);
};
