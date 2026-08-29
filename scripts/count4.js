require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query('SELECT count(*) FROM "Question"');
  console.log("EXACT_COUNT:", result.rows[0].count);
  await pool.end();
}

main().catch(console.error);
