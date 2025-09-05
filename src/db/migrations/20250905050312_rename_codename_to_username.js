exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.renameColumn("codename", "username");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.renameColumn("username", "codename");
  });
};
