const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../db');
const venues = require('./venues');

const seedVenueQuery = `
  INSERT INTO venues (slug, name, genre, price, event_date, venue, location, image, summary, lineup, description)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  ON CONFLICT (slug) DO NOTHING`;

async function initializeDatabase() {
  if (!pool) {
    throw new Error('Set DATABASE_URL to your PostgreSQL connection string before setting up the database.');
  }

  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');

  try {
    await pool.query('BEGIN');
    await pool.query(schema);
    for (const venue of venues) {
      await pool.query(seedVenueQuery, [
        venue.slug,
        venue.name,
        venue.genre,
        venue.price,
        venue.date,
        venue.venue,
        venue.location,
        venue.image,
        venue.summary,
        venue.lineup,
        venue.description
      ]);
    }
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

module.exports = { initializeDatabase };