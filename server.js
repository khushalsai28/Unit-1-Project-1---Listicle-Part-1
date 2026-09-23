const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const venues = [
  {
    id: 1,
    slug: 'velvet-room',
    name: 'Velvet Room',
    genre: 'Indie Rock',
    price: '$18',
    date: 'Friday • 8:30 PM',
    venue: 'East Market Hall',
    location: 'Riverside',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    summary: 'A moody listening room with intimate sets and a loyal local crowd.',
    lineup: 'Midnight Echo, The Lanterns, Clover Club',
    description:
      'The Velvet Room is a hidden gem for fans of indie and alternative music. The room is dimly lit, the sound is crisp, and every set feels like a neighborhood secret. It is the kind of venue where you can discover your next favorite band before they hit the big stage.'
  },
  {
    id: 2,
    slug: 'harbor-stage',
    name: 'Harbor Stage',
    genre: 'Jazz',
    price: '$15',
    date: 'Saturday • 7:00 PM',
    venue: 'Waterfront Pavilion',
    location: 'Harbor District',
    image:
      'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80',
    summary: 'A waterfront venue hosting smooth jazz sets and sunset cocktails.',
    lineup: 'Northline Quartet, June Avenue, The Green Room Trio',
    description:
      'Harbor Stage brings a relaxed, upscale feel to live music with sweeping views of the bay and carefully curated jazz sessions. It is the perfect place for a date night or a low-key evening with friends who appreciate improvisation, classic standards, and jazz fusion.'
  },
  {
    id: 3,
    slug: 'neon-loft',
    name: 'Neon Loft',
    genre: 'Electronic',
    price: '$22',
    date: 'Thursday • 10:00 PM',
    venue: 'Warehouse 9',
    location: 'Downtown Arts District',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    summary: 'A late-night dance floor for house, synthwave, and futuristic soundscapes.',
    lineup: 'Kite Runner, Aster Vale, Dial Tone',
    description:
      'Neon Loft feels like stepping into a music video from the future. Floor-to-ceiling lights, bass-heavy sound systems, and a rotating set of electronic artists create an energizing night out for dancers and festival lovers alike. It is loud, immersive, and built for midnight energy.'
  },
  {
    id: 4,
    slug: 'cedar-cafe',
    name: 'Cedar & Co. Cafe',
    genre: 'Acoustic',
    price: '$10',
    date: 'Sunday • 5:30 PM',
    venue: 'Cedar & Co. Cafe',
    location: 'Old Town',
    image:
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=80',
    summary: 'Coffeehouse sessions with acoustic folk, singer-songwriters, and open mic nights.',
    lineup: 'Mara Wells, The Cedar Songwriters, Open Mic Hour',
    description:
      'Cedar & Co. Cafe is where students and locals go for low-pressure music nights. The intimate setup encourages conversation and connection, and the acoustic sets feel personal and warm. It is the community heart of the neighborhood and a favorite for relaxed gatherings.'
  },
  {
    id: 5,
    slug: 'skyline-amphitheater',
    name: 'Skyline Amphitheater',
    genre: 'Festival',
    price: '$35',
    date: 'Saturday • 6:45 PM',
    venue: 'Hilltop Grounds',
    location: 'North Ridge',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    summary: 'An open-air festival stage with headline acts, food trucks, and sunset views.',
    lineup: 'Sunset Parade, City Bloom, Afterglow Collective',
    description:
      'Skyline Amphitheater turns live music into a full community event with food stalls, lawn seating, and panoramic city views. It is ideal for large groups, festival energy, and discovering new artists while enjoying a warm evening outside. The experience feels celebratory from the first chord to the final encore.'
  },
  {
    id: 6,
    slug: 'paper-bell',
    name: 'Paper Bell Studio',
    genre: 'Folk',
    price: '$12',
    date: 'Wednesday • 7:15 PM',
    venue: 'Paper Bell Loft',
    location: 'North Loop',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    summary: 'A creative studio space for folk artists, storytellers, and warm acoustic sets.',
    lineup: 'Hollow Pines, Rowan Vale, Lark & Stone',
    description:
      'Paper Bell Studio blends live music with the feeling of an artist retreat. The room is compact, the sets feel intimate, and the audience is often made up of devoted fans and curious newcomers alike. It is a favorite stop for folk lovers seeking heartfelt songwriting and community energy.'
  }
];

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
            <img src="${venue.image}" alt="${venue.name} performance" />
            <div class="detail-content">
              <p class="eyebrow">${venue.genre}</p>
              <h1>${venue.name}</h1>
              <p class="summary">${venue.summary}</p>

              <dl>
                <div>
                  <dt>Venue</dt>
                  <dd>${venue.venue}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>${venue.location}</dd>
                </div>
                <div>
                  <dt>Date & time</dt>
                  <dd>${venue.date}</dd>
                </div>
                <div>
                  <dt>Ticket price</dt>
                  <dd>${venue.price}</dd>
                </div>
                <div>
                  <dt>Featured lineup</dt>
                  <dd>${venue.lineup}</dd>
                </div>
              </dl>

              <section>
                <h2>About the night</h2>
                <p>${venue.description}</p>
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

app.get('/api/items', (req, res) => {
  res.json(venues);
});

app.get('/api/items/:slug', (req, res) => {
  const venue = venues.find((item) => item.slug === req.params.slug);

  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  return res.json(venue);
});

app.get('/items/:slug', (req, res) => {
  const venue = venues.find((item) => item.slug === req.params.slug);

  if (!venue) {
    return res.status(404).send(renderNotFoundPage('Venue not found'));
  }

  return res.send(renderDetailPage(venue));
});

app.get('/:slug', (req, res) => {
  const venue = venues.find((item) => item.slug === req.params.slug);

  if (!venue) {
    return res.status(404).send(renderNotFoundPage());
  }

  return res.send(renderDetailPage(venue));
});

app.use((req, res) => {
  res.status(404).send(renderNotFoundPage());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
