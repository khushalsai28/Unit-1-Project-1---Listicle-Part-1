const venueList = document.getElementById('venue-list');
const searchForm = document.getElementById('venue-search');
const searchQuery = document.getElementById('search-query');

async function fetchVenues(search = '') {
  const response = await fetch(`/api/items?search=${encodeURIComponent(search)}`);

  if (!response.ok) {
    throw new Error('Unable to fetch venues');
  }

  return response.json();
}

function escapeHTML(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function renderVenues(venues) {
  if (venues.length === 0) {
    venueList.innerHTML = '<p class="empty-state">No venues match that search.</p>';
    return;
  }

  venueList.innerHTML = venues
    .map(
      (venue) => `
        <article class="venue-card">
          <a href="/items/${encodeURIComponent(venue.slug)}" aria-label="View details for ${escapeHTML(venue.name)}">
            <img src="${escapeHTML(venue.image)}" alt="${escapeHTML(venue.name)}" />
            <div class="venue-card-content">
              <div class="meta-row">
                <span>${escapeHTML(venue.genre)}</span>
                <strong>${escapeHTML(venue.price)}</strong>
              </div>
              <h2>${escapeHTML(venue.name)}</h2>
              <div class="meta-row">
                <span>${escapeHTML(venue.location)}</span>
                <span>${escapeHTML(venue.date)}</span>
              </div>
              <p>${escapeHTML(venue.summary)}</p>
            </div>
          </a>
        </article>
      `
    )
    .join('');
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  fetchVenues(searchQuery.value.trim())
    .then(renderVenues)
    .catch(showLoadError);
});

function showLoadError(error) {
  console.error(error);
  venueList.innerHTML = '<p>Unable to load venues right now.</p>';
}

fetchVenues()
  .then((venues) => renderVenues(venues))
  .catch(showLoadError);
