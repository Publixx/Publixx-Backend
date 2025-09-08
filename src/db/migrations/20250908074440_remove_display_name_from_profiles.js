exports.up = function (knex) {
  return knex.schema.table("profiles", (table) => {
    table.dropColumn("display_name");
  });
};

exports.down = function (knex) {
  return knex.schema.table("profiles", (table) => {
    table.string("display_name");
  });
};
