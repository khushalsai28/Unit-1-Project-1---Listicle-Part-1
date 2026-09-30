const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../db');

async function setupDatabase() {
  if (!pool) {
    throw new Error('Set DATABASE_URL to your PostgreSQL connection string before setting up the database.');
  }

  const schema = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  const seed = await fs.readFile(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');

  try {
    await pool.query('BEGIN');
    await pool.query(schema);
    await pool.query(seed);
    await pool.query('COMMIT');
    console.log('Database schema is ready and venue records are seeded.');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
    await pool.end();
  }
}

setupDatabase().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});