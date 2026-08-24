import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1 
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT "subTopic", COUNT(*) as count 
      FROM "Question" 
      GROUP BY "subTopic" 
      ORDER BY count DESC
    `);
    
    console.log("Question Counts by SubTopic:");
    console.log("----------------------------");
    for (const row of res.rows) {
      console.log(`${row.subTopic.padEnd(40)} | ${row.count}`);
    }
  } catch (err) {
    console.error("Error fetching counts:", err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
