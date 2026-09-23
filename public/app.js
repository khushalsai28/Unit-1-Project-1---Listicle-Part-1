const venueList = document.getElementById('venue-list');

async function fetchVenues() {
  const response = await fetch('/api/items');

  if (!response.ok) {
    throw new Error('Unable to fetch venues');
  }

  return response.json();
}

function renderVenues(venues) {
  venueList.innerHTML = venues
    .map(
      (venue) => `
        <article class="venue-card">
          <a href="/items/${venue.slug}" aria-label="View details for ${venue.name}">
            <img src="${venue.image}" alt="${venue.name}" />
            <div class="venue-card-content">
              <div class="meta-row">
                <span>${venue.genre}</span>
                <strong>${venue.price}</strong>
              </div>
              <h2>${venue.name}</h2>
              <div class="meta-row">
                <span>${venue.location}</span>
                <span>${venue.date}</span>
              </div>
              <p>${venue.summary}</p>
            </div>
          </a>
        </article>
      `
    )
    .join('');
}

fetchVenues()
  .then((venues) => renderVenues(venues))
  .catch((error) => {
    console.error(error);
    venueList.innerHTML = '<p>Unable to load venues right now.</p>';
  });
