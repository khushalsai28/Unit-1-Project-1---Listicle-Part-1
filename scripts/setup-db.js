const { pool } = require('../db');
const { initializeDatabase } = require('../db/initialize');

async function setupDatabase() {
  if (!pool) {
    throw new Error('Set DATABASE_URL to your PostgreSQL connection string before setting up the database.');
  }

  try {
    await initializeDatabase();
    console.log('Database schema is ready and venue records are seeded.');
  } finally {
    await pool.end();
  }
}

setupDatabase().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});