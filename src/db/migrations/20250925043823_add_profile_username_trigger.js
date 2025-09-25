// migrations/20250924120000_add_profile_username_trigger.js

exports.up = async function (knex) {
  await knex.raw(`
    -- Create sync function
    CREATE OR REPLACE FUNCTION sync_profile_username()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE profiles
      SET username = NEW.username
      WHERE user_id = NEW.id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Attach trigger to users table
    CREATE TRIGGER update_profile_username
    AFTER UPDATE OF username ON users
    FOR EACH ROW
    EXECUTE PROCEDURE sync_profile_username();
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP TRIGGER IF EXISTS update_profile_username ON users;
    DROP FUNCTION IF EXISTS sync_profile_username;
  `);
};
