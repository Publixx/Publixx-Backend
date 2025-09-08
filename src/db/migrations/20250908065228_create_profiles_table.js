exports.up = function (knex) {
  return knex.schema.createTable("profiles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("display_name");
    table.text("bio");
    table.string("masked_photo_url");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("profiles");
};
