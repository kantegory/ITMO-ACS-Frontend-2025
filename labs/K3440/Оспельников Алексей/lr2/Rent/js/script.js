async function getCardHtml({ name, adress, link, price, rating }) {
    return `
    <div class="card h-100 shadow-sm">
        <img src="assets/images/property1.jpg" class="card-img-top" alt="Квартира в центре" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${name}</h5>
            <p class="card-text text-muted small">${adress}</p>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-success">₽ ${price} / мес</span>
                <span class="text-muted small">⭐ ${rating}</span>
            </div>
            <ul class="list-unstyled small mb-3">
                <li><i class="fas fa-bed me-1"></i> 2 спальни</li>
                <li><i class="fas fa-bath me-1"></i> 1 ванная</li>
                <li><i class="fas fa-ruler-combined me-1"></i> 65 м²</li>
            </ul>
            <a href="property.html" class="btn btn-outline-primary mt-auto">Подробнее</a>
        </div>
    </div>
    `
}


async function getProperties() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/properties', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}


async function getPropertiesByFilter(type, price, location) {
  const token = localStorage.getItem('token');
  let url = `http://localhost:3001/properties?`;
  if (type) url += `type=${type}&`;
  if (price) url += `price_lte=${price}&`;
  if (location) url += `location_like=${location}&`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}
