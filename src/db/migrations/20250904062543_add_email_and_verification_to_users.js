exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("email").unique(); // allow nulls initially
    table.boolean("is_verified").defaultTo(false);
    table.string("otp_code");
    table.timestamp("otp_expiry");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("email");
    table.dropColumn("is_verified");
    table.dropColumn("otp_code");
    table.dropColumn("otp_expiry");
  });
};
