exports.up = async function (knex) {
  await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id)");
  await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_votes_submission ON votes(submission_id)");
};

exports.down = async function (knex) {
  await knex.schema.raw("DROP INDEX IF EXISTS idx_submissions_user");
  await knex.schema.raw("DROP INDEX IF EXISTS idx_votes_submission");
};
