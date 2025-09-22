exports.up = function (knex) {
  return knex.schema.createTable("game_access", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.boolean("has_access").defaultTo(false);
    table.integer("unlocked_stage").defaultTo(0); // 0 = locked until purchase
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("game_access");
};
