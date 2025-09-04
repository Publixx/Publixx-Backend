exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("codename", 60).unique().notNullable();
    table.text("password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("submissions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.integer("stage").notNullable();
    table.jsonb("photos");
    table.text("video_url");
    table.string("status").defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("votes", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("voter_id").references("id").inTable("users").onDelete("CASCADE");
    table
      .uuid("submission_id")
      .references("id")
      .inTable("submissions")
      .onDelete("CASCADE");
    table.integer("score").notNullable().checkBetween([1, 5]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["voter_id", "submission_id"]);
  });

  await knex.schema.raw(
    "ALTER TABLE submissions ADD CONSTRAINT stage_check CHECK (stage BETWEEN 1 AND 5)"
  );
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("votes");
  await knex.schema.dropTableIfExists("submissions");
  await knex.schema.dropTableIfExists("users");
};
