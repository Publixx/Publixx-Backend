const fs = require("fs");
const path = require("path");
const pool = require("../config/postgres.rds");

(async () => {
  try {
    const schemaDir = path.join(__dirname, "schema");
    const files = fs.readdirSync(schemaDir).sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(schemaDir, file), "utf8");
      console.log(`Applying ${file}...`);
      await pool.query(sql);
    }
    console.log("✅ Schema initialized");
    process.exit(0);
  } catch (err) {
    console.error("❌ Schema init failed", err);
    process.exit(1);
  }
})();
