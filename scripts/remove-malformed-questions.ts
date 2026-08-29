import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { Pool } from 'pg';

// Initialize a tiny pool so we don't exhaust Neon
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1 
});

async function main() {
  console.log("Fetching questions from database via raw pg...");
  
  const client = await pool.connect();
  const idsToDelete: string[] = [];

  try {
    const res = await client.query('SELECT id, prompt, options, type FROM "Question"');
    const questions = res.rows;
    console.log(`Fetched ${questions.length} questions in total.`);

    for (const q of questions) {
      let isBad = false;

      // 1. Check prompt length
      if (!q.prompt || typeof q.prompt !== 'string' || q.prompt.trim().length < 15) {
        isBad = true;
      }

      // 2. Formatting issues
      if (!isBad && (
          q.prompt.includes('undefined') || 
          q.prompt.includes('[object Object]') || 
          q.prompt.includes('\\frac') ||
          q.prompt.includes('\\log') ||
          q.prompt.includes('$\\')
      )) {
        isBad = true;
      }

      // 3. Options validation
      if (!isBad) {
        try {
          let opts = q.options;
          if (typeof opts === 'string') {
            opts = JSON.parse(opts);
          }
          
          if (!Array.isArray(opts) || opts.length < 2) {
            isBad = true;
          } else if (opts.some((o: any) => !o || typeof o !== 'string' || o.trim() === '' || o === 'undefined' || o === 'null')) {
            isBad = true;
          }
        } catch (e) {
          isBad = true;
        }
      }

      if (isBad) {
        idsToDelete.push(q.id);
      }
    }

    console.log(`\nIdentified ${idsToDelete.length} malformed questions.`);

    if (idsToDelete.length > 0) {
      console.log("Deleting malformed questions...");
      
      const BATCH_SIZE = 100;
      for (let i = 0; i < idsToDelete.length; i += BATCH_SIZE) {
        const batchIds = idsToDelete.slice(i, i + BATCH_SIZE);
        
        // Build parametrized query
        const params = batchIds.map((_, idx) => `$${idx + 1}`).join(',');
        await client.query(`DELETE FROM "Question" WHERE id IN (${params})`, batchIds);
        
        console.log(`Deleted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(idsToDelete.length / BATCH_SIZE)}`);
      }

      console.log("Cleanup complete!");
    } else {
      console.log("No malformed questions found.");
    }
  } catch (err) {
    console.error("Error during execution", err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
