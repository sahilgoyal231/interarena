import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1 
});

async function main() {
  console.log("Connecting to database to purge all DEBUG_CODE questions...");
  const client = await pool.connect();
  
  try {
    const res = await client.query('DELETE FROM "Question" WHERE type = $1 RETURNING id', ['DEBUG_CODE']);
    console.log(`Successfully purged ${res.rowCount} DEBUG_CODE questions from the database.`);
  } catch (err) {
    console.error("Error purging questions:", err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
