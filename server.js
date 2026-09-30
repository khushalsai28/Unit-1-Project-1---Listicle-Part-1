const express = require('express');
const path = require('path');
const { pool, query } = require('./db');
const { initializeDatabase } = require('./db/initialize');
const seedVenues = require('./db/venues');

const app = express();
const PORT = process.env.PORT || 3000;
const useLocalSeed = !pool && process.env.NODE_ENV !== 'production';
const venueFields = `
  id, slug, name, genre, price, event_date AS date, venue, location, image, summary, lineup,
  description`;

function escapeHTML(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function findLocalVenues(search = '') {
  const normalizedSearch = search.toLowerCase();
  return seedVenues.filter((venue) =>
    [venue.name, venue.genre, venue.location].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    )
  );
}

function renderNotFoundPage(message = 'Page not found') {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 | City Pulse Guide</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="container not-found">
          <article>
            <p class="eyebrow">404</p>
            <h1>${message}</h1>
            <p>The page you were looking for does not exist in the guide.</p>
            <a href="/" role="button">Return home</a>
          </article>
        </main>
      </body>
    </html>`;
}

function renderDetailPage(venue) {
  const safeVenue = Object.fromEntries(
    Object.entries(venue).map(([key, value]) => [key, escapeHTML(value)])
  );

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${venue.name} | City Pulse Guide</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <main class="container detail-page">
          <nav aria-label="Breadcrumb">
            <a href="/">← Back to venues</a>
          </nav>
          <article class="detail-card">
            <img src="${safeVenue.image}" alt="${safeVenue.name} performance" />
            <div class="detail-content">
              <p class="eyebrow">${safeVenue.genre}</p>
              <h1>${safeVenue.name}</h1>
              <p class="summary">${safeVenue.summary}</p>

              <dl>
                <div>
                  <dt>Venue</dt>
                  <dd>${safeVenue.venue}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>${safeVenue.location}</dd>
                </div>
                <div>
                  <dt>Date & time</dt>
                  <dd>${safeVenue.date}</dd>
                </div>
                <div>
                  <dt>Ticket price</dt>
                  <dd>${safeVenue.price}</dd>
                </div>
                <div>
                  <dt>Featured lineup</dt>
                  <dd>${safeVenue.lineup}</dd>
                </div>
              </dl>

              <section>
                <h2>About the night</h2>
                <p>${safeVenue.description}</p>
              </section>
            </div>
          </article>
        </main>
      </body>
    </html>`;
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/items', async (req, res) => {
  const search = String(req.query.search || '').trim();
  if (useLocalSeed) {
    return res.json(findLocalVenues(search));
  }

  try {
    const result = await query(
      `SELECT ${venueFields} FROM venues
       WHERE $1 = '' OR name ILIKE $2 OR genre ILIKE $2 OR location ILIKE $2
       ORDER BY id`,
      [search, `%${search}%`]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Unable to fetch venues:', error.message);
    return res.status(503).json({ message: 'Venue data is temporarily unavailable' });
  }
});

app.get('/api/items/:slug', async (req, res) => {
  if (useLocalSeed) {
    const venue = seedVenues.find((item) => item.slug === req.params.slug);
    return venue ? res.json(venue) : res.status(404).json({ message: 'Venue not found' });
  }

  try {
    const result = await query(
      `SELECT ${venueFields} FROM venues WHERE slug = $1`,
      [req.params.slug]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Unable to fetch venue:', error.message);
    return res.status(503).json({ message: 'Venue data is temporarily unavailable' });
  }
});

async function sendVenuePage(req, res) {
  if (useLocalSeed) {
    const venue = seedVenues.find((item) => item.slug === req.params.slug);
    return venue
      ? res.send(renderDetailPage(venue))
      : res.status(404).send(renderNotFoundPage('Venue not found'));
  }

  try {
    const result = await query(
      `SELECT ${venueFields} FROM venues WHERE slug = $1`,
      [req.params.slug]
    );
    if (!result.rows[0]) {
      return res.status(404).send(renderNotFoundPage('Venue not found'));
    }
    return res.send(renderDetailPage(result.rows[0]));
  } catch (error) {
    console.error('Unable to render venue:', error.message);
    return res.status(503).send('Venue data is temporarily unavailable.');
  }
}

app.get('/items/:slug', sendVenuePage);

app.get('/:slug', sendVenuePage);

app.use((req, res) => {
  res.status(404).send(renderNotFoundPage());
});

async function startServer() {
  if (pool) {
    await initializeDatabase();
    console.log('PostgreSQL schema and venue data are ready.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start the app:', error.message);
  process.exitCode = 1;
});
