exports.up = function (knex) {
  return knex.schema.createTable("stages", (table) => {
    table.integer("id").primary(); // 1–5
    table.string("name").notNullable();
    table.text("description");
    table.boolean("is_final").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("stages");
};
