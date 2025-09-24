exports.up = function (knex) {
  return knex.schema.table("profiles", (table) => {
    table.string("username").notNullable().defaultTo(""); // add username column
  });
};

exports.down = function (knex) {
  return knex.schema.table("profiles", (table) => {
    table.dropColumn("username");
  });
};
