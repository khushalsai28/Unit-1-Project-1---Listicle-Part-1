const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
const databaseHost = databaseUrl ? new URL(databaseUrl).hostname : '';
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseHost.endsWith('render.com') ? { rejectUnauthorized: false } : undefined
    })
  : null;

async function query(...args) {
  if (!pool) {
    throw new Error('DATABASE_URL is not set. Configure it with your PostgreSQL connection string.');
  }
  return pool.query(...args);
}

module.exports = { pool, query };