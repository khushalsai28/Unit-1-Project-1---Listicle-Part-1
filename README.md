# WEB103 Unit 1 & 2: Listicle Part 1 and Part 2 - Individual

Submitted by: Khushal Sai kolagani

About this web app: This app is a music venue guide that helps users discover local venues for indie rock, jazz, electronic, acoustic, and festival nights. Each venue is displayed in a stylish card list and includes key details such as genre, price, date, location, and summary. Users can click on any venue to view a full details page with all the venue information.

Time spent: 20 hours

## Project Features

The project uses a vanilla HTML, CSS, and JavaScript frontend with an Express API backed by PostgreSQL.

- [x] Frontend uses HTML, CSS, and JavaScript without a framework
- [x] Venue list and detail pages are read from a PostgreSQL database
- [x] Database table has a unique slug and fields for each venue attribute
- [x] At least five seeded venue records are displayed
- [x] Search filters by venue name, genre, or location
- [x] Detail pages use unique URLs and unknown venues receive a 404 page
- [x] App is styled using PicoCSS

## Database Setup

Create a PostgreSQL database on Render and copy its **Internal Database URL** into the `DATABASE_URL` environment variable for the web service. For local development, set `DATABASE_URL` in your shell to a PostgreSQL connection string. Do not commit database credentials.

Run the schema and seed scripts once after configuring the URL:

```sh
npm install
npm run db:setup
npm run dev
```

`db/schema.sql` creates the `venues` table and `db/seed.sql` inserts the six sample venues. The setup script is safe to rerun: existing slugs are not inserted a second time. The Render web service should use `npm start` as its start command and have the same `DATABASE_URL` configured.

The API reads list data from `GET /api/items` and detail data from `GET /api/items/:slug`. Pass `?search=...` to the list endpoint to match venue name, genre, or location.

## Video Walkthrough

**Note: please be sure to include a walkthrough video in the submission**

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ... Add GIF tool here
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

This project was built using a simple Express backend and static frontend assets. One of the main challenges was setting up the route structure so the homepage, individual venue pages, and 404 page all worked together cleanly. The app also uses PicoCSS for a modern, minimal design while maintaining a fully vanilla HTML/CSS/JS architecture.

## License

Copyright [2026] [Khushal Sai Kolagani]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
