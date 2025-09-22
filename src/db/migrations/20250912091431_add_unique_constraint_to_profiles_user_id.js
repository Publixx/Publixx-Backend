exports.up = function(knex) {
  return knex.schema.alterTable("profiles", (table) => {
    table.unique("user_id");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("profiles", (table) => {
    table.dropUnique("user_id");
  });
};
