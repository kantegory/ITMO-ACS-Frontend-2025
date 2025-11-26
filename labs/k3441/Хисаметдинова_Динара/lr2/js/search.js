let properties = [];
let filteredProperties = [];
let currentPage = 1;
let itemsPerPage = 12;
let currentSort = 'price';
let currentView = 'grid';
let filters = {
    location: '',
    checkIn: '',
    checkOut: '',
    propertyTypes: [],
    minPrice: 10,
    maxPrice: 500,
    adults: 1,
    children: 0,
    rooms: 1,
    amenities: [],
    minRating: 0
};

const sampleProperties = [
    {
        id: 1,
        title: 'Cozy Belgrade Apartment',
        location: 'Belgrade, Serbia',
        type: 'apartment',
        price: 30,
        rating: 4.2,
        reviews: 47,
        image: 'images/cozy-belgrade-apartment.jpg',
        amenities: ['wifi', 'kitchen', 'parking'],
        maxGuests: 4,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Charming apartment in the heart of Belgrade with authentic Socialist architecture.'
    },
    {
        id: 2,
        title: 'Modern Krakow Loft',
        location: 'Krakow, Poland',
        type: 'apartment',
        price: 225,
        rating: 4.8,
        reviews: 112,
        image: 'images/modern-krakow-loft.jpg',
        amenities: ['wifi', 'aircon', 'kitchen', 'washer'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Contemporary loft in historic Krakow with modern amenities.'
    },
    {
        id: 3,
        title: 'Bucharest Studio',
        location: 'Bucharest, Romania',
        type: 'studio',
        price: 24,
        rating: 3.9,
        reviews: 33,
        image: 'images/bucharest-studio.jpg',
        amenities: ['wifi', 'kitchen'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Affordable studio apartment perfect for short stays in Bucharest.'
    },
    {
        id: 4,
        title: 'Riga Luxury Suite',
        location: 'Riga, Latvia',
        type: 'apartment',
        price: 190,
        rating: 4.6,
        reviews: 89,
        image: 'images/riga-luxury-suite.jpg',
        amenities: ['wifi', 'aircon', 'kitchen', 'washer', 'parking'],
        maxGuests: 6,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Luxurious apartment with Baltic Sea views in historic Riga.'
    },
    {
        id: 5,
        title: 'Prague Historic House',
        location: 'Prague, Czech Republic',
        type: 'house',
        price: 120,
        rating: 4.4,
        reviews: 67,
        image: 'images/prague-historic-house.jpg',
        amenities: ['wifi', 'kitchen', 'parking', 'washer'],
        maxGuests: 8,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Beautiful historic house in Prague with traditional architecture.'
    },
    {
        id: 6,
        title: 'Ljubljana Garden Apartment',
        location: 'Ljubljana, Slovenia',
        type: 'apartment',
        price: 80,
        rating: 4.3,
        reviews: 54,
        image: 'images/ljubljana-garden-apartment.jpg',
        amenities: ['wifi', 'kitchen', 'parking'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: 'Peaceful apartment with garden access in Ljubljana center.'
    },
    {
        id: 7,
        title: 'Warsaw Modern Flat',
        location: 'Warsaw, Poland',
        type: 'apartment',
        price: 95,
        rating: 4.1,
        reviews: 76,
        image: 'images/warsaw-modern-flat.jpg',
        amenities: ['wifi', 'aircon', 'kitchen'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Modern apartment in Warsaw business district.'
    },
    {
        id: 8,
        title: 'Budapest Hotel Room',
        location: 'Budapest, Hungary',
        type: 'hotel',
        price: 160,
        rating: 4.5,
        reviews: 203,
        image: 'images/budapest-hotel.jpg',
        amenities: ['wifi', 'aircon'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Elegant hotel room with Danube River views.'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    loadProperties();
    initializePriceSlider();
    initializeFilters();
    checkAuthentication();
});

function initializeSearch() {
    const urlParams = new URLSearchParams(window.location.search);

    console.log('All URL params:', Object.fromEntries(urlParams));

    if (urlParams.get('location')) {
        filters.location = urlParams.get('location');
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.value = filters.location;
            console.log('Set location filter to:', filters.location);
        } else {
            console.error('locationFilter element not found');
        }
    }

    if (urlParams.get('checkIn')) {
        filters.checkIn = urlParams.get('checkIn');
        const checkInDate = document.getElementById('checkInDate');
        if (checkInDate) {
            checkInDate.value = filters.checkIn;
            console.log('Set checkIn to:', filters.checkIn);
        } else {
            console.error('checkInDate element not found');
        }
    }

    if (urlParams.get('checkOut')) {
        filters.checkOut = urlParams.get('checkOut');
        const checkOutDate = document.getElementById('checkOutDate');
        if (checkOutDate) {
            checkOutDate.value = filters.checkOut;
            console.log('Set checkOut to:', filters.checkOut);
        } else {
            console.error('checkOutDate element not found');
        }
    }

    if (urlParams.get('adults')) {
        filters.adults = parseInt(urlParams.get('adults')) || 1;
        const adultsCount = document.getElementById('adultsCount');
        if (adultsCount) {
            adultsCount.textContent = filters.adults;
            console.log('Set adults to:', filters.adults);
        } else {
            console.error('adultsCount element not found');
        }
    }

    if (urlParams.get('children')) {
        filters.children = parseInt(urlParams.get('children')) || 0;
        const childrenCount = document.getElementById('childrenCount');
        if (childrenCount) {
            childrenCount.textContent = filters.children;
            console.log('Set children to:', filters.children);
        } else {
            console.error('childrenCount element not found');
        }
    }

    if (urlParams.get('rooms')) {
        filters.rooms = parseInt(urlParams.get('rooms')) || 1;
        const roomsCount = document.getElementById('roomsCount');
        if (roomsCount) {
            roomsCount.textContent = filters.rooms;
            console.log('Set rooms to:', filters.rooms);
        } else {
            console.error('roomsCount element not found');
        }
    }

    if (properties.length > 0) {
        applyFilters();
    }
}

function checkAuthentication() {
    const userData = localStorage.getItem('user');
    const loginLink = document.getElementById('loginLink');

    if (userData) {
        const user = JSON.parse(userData);
        loginLink.innerHTML = `<i class="fas fa-user me-1"></i>${user.firstName || 'Profile'}`;
        loginLink.href = 'profile.html';
    }
}

function loadProperties() {
    setTimeout(() => {
        properties = [...sampleProperties];
        applyFilters();
        hideLoading();
    }, 2000);
}

function hideLoading() {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('resultsContainer').classList.remove('d-none');
}

function initializePriceSlider() {
    const priceRange = document.getElementById('priceRange');

    if (priceRange) {
        noUiSlider.create(priceRange, {
            start: [10, 500],
            connect: true,
            range: {
                'min': 10,
                'max': 500
            },
            format: {
                to: function (value) {
                    return Math.round(value);
                },
                from: function (value) {
                    return Math.round(value);
                }
            }
        });

        priceRange.noUiSlider.on('update', function (values, handle) {
            filters.minPrice = parseInt(values[0]);
            filters.maxPrice = parseInt(values[1]);
            document.getElementById('minPriceDisplay').textContent = filters.minPrice;
            document.getElementById('maxPriceDisplay').textContent = filters.maxPrice;
        });
    }
}

function initializeFilters() {
    
    document.getElementById('locationFilter').addEventListener('input', function() {
        filters.location = this.value;
    });

   
    document.getElementById('checkInDate').addEventListener('change', function() {
        filters.checkIn = this.value;
    });

    document.getElementById('checkOutDate').addEventListener('change', function() {
        filters.checkOut = this.value;
    });


    const propertyTypes = ['apartment', 'house', 'studio', 'hotel'];
    propertyTypes.forEach(type => {
        const checkbox = document.getElementById(`type${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    filters.propertyTypes.push(type);
                } else {
                    filters.propertyTypes = filters.propertyTypes.filter(t => t !== type);
                }
            });
        }
    });

    const amenities = ['wifi', 'parking', 'kitchen', 'aircon', 'washer'];
    amenities.forEach(amenity => {
        const checkbox = document.getElementById(`${amenity}Amenity`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    filters.amenities.push(amenity);
                } else {
                    filters.amenities = filters.amenities.filter(a => a !== amenity);
                }
            });
        }
    });

    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            filters.minRating = parseFloat(this.value);
        });
    });

    const sortItems = document.querySelectorAll('[data-sort]');
    sortItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            currentSort = this.dataset.sort;
            document.getElementById('sortBtn').innerHTML =
                `<i class="fas fa-sort me-2"></i>Sort by: ${this.textContent}`;
            sortAndRenderProperties();
        });
    });
}

function changeGuests(type, delta) {
    if (type === 'adults') {
        filters.adults = Math.max(1, filters.adults + delta);
        document.getElementById('adultsCount').textContent = filters.adults;
    } else if (type === 'children') {
        filters.children = Math.max(0, filters.children + delta);
        document.getElementById('childrenCount').textContent = filters.children;
    }
}

function applyFilters() {
    filteredProperties = properties.filter(property => {
      
        if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }

       
        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
            return false;
        }


        if (property.price < filters.minPrice || property.price > filters.maxPrice) {
            return false;
        }

        if (property.maxGuests < filters.adults + filters.children) {
            return false;
        }

        if (filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every(amenity =>
                property.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }

        if (property.rating < filters.minRating) {
            return false;
        }

        return true;
    });

    sortAndRenderProperties();
    updateResultsCount();
}

function sortAndRenderProperties() {
    filteredProperties.sort((a, b) => {
        switch (currentSort) {
            case 'price':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'distance':
                return 0; 
            default:
                return 0;
        }
    });

    renderProperties();
    renderPagination();
}

function renderProperties() {
    const propertyGrid = document.getElementById('propertyGrid');
    const noResults = document.getElementById('noResults');

    if (filteredProperties.length === 0) {
        propertyGrid.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProperties = filteredProperties.slice(startIndex, endIndex);

    const propertiesHTML = pageProperties.map(property => `
        <div class="property-card card shadow-sm" onclick="showPropertyDetails(${property.id})">
            <div class="position-relative">
                <img src="${property.image}" alt="${property.title}" class="card-img-top" style="height: 200px; object-fit: cover;">
                <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2" onclick="event.stopPropagation(); toggleFavorite(${property.id})">
                    <i class="far fa-heart" id="heart-${property.id}"></i>
                </button>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="badge bg-primary">${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                    <div class="d-flex align-items-center">
                        <span class="text-warning me-1">★</span>
                        <span class="small">${property.rating}</span>
                        <span class="text-muted small ms-1">(${property.reviews})</span>
                    </div>
                </div>
                <h6 class="card-title">${property.title}</h6>
                <p class="card-text text-muted small">${property.location}</p>
                <div class="d-flex align-items-center mb-2">
                    <small class="text-muted">
                        <i class="fas fa-users me-1"></i>${property.maxGuests} guests
                        <i class="fas fa-bed ms-2 me-1"></i>${property.bedrooms} bed
                        <i class="fas fa-bath ms-2 me-1"></i>${property.bathrooms} bath
                    </small>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="amenities">
                        ${property.amenities.slice(0, 3).map(amenity => `
                            <i class="fas fa-${getAmenityIcon(amenity)} text-muted me-1" title="${amenity}"></i>
                        `).join('')}
                        ${property.amenities.length > 3 ? `<span class="text-muted small">+${property.amenities.length - 3}</span>` : ''}
                    </div>
                    <div class="text-end">
                        <span class="fw-bold text-primary">$${property.price}</span>
                        <small class="text-muted d-block">per night</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    propertyGrid.innerHTML = propertiesHTML;
}

function getAmenityIcon(amenity) {
    const icons = {
        wifi: 'wifi',
        parking: 'parking',
        kitchen: 'utensils',
        aircon: 'snowflake',
        washer: 'tshirt'
    };
    return icons[amenity] || 'check';
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    if (currentPage < totalPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;
    }

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderProperties();
    renderPagination();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateResultsCount() {
    const searchResults = document.getElementById('searchResults');
    const count = filteredProperties.length;

    if (count === 0) {
        searchResults.textContent = 'No properties found';
    } else {
        searchResults.textContent = `Found ${count} propert${count === 1 ? 'y' : 'ies'}`;
    }
}

function clearAllFilters() {
    filters = {
        location: '',
        checkIn: '',
        checkOut: '',
        propertyTypes: [],
        minPrice: 10,
        maxPrice: 500,
        adults: 1,
        children: 0,
        rooms: 1,
        amenities: [],
        minRating: 0
    };

    document.getElementById('locationFilter').value = '';
    document.getElementById('checkInDate').value = '';
    document.getElementById('checkOutDate').value = '';
    document.getElementById('adultsCount').textContent = '1';
    document.getElementById('childrenCount').textContent = '0';
    document.getElementById('roomsCount').textContent = '1';

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);

    const priceRange = document.getElementById('priceRange');
    if (priceRange && priceRange.noUiSlider) {
        priceRange.noUiSlider.set([10, 500]);
    }

    applyFilters();
}

function toggleView() {
    currentView = currentView === 'grid' ? 'list' : 'grid';
    const viewIcon = document.getElementById('viewIcon');
    const propertyGrid = document.getElementById('propertyGrid');

    if (currentView === 'list') {
        viewIcon.classList.remove('fa-th-large');
        viewIcon.classList.add('fa-th-list');
        propertyGrid.classList.remove('property-grid');
        propertyGrid.classList.add('property-list');
    } else {
        viewIcon.classList.remove('fa-th-list');
        viewIcon.classList.add('fa-th-large');
        propertyGrid.classList.remove('property-list');
        propertyGrid.classList.add('property-grid');
    }
}

function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
    document.getElementById('modalPropertyTitle').textContent = property.title;

    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <img src="${property.image}" alt="${property.title}" class="img-fluid rounded mb-3">
                <div class="d-flex align-items-center mb-3">
                    <span class="text-warning me-2">★★★★☆</span>
                    <span>${property.rating} (${property.reviews} reviews)</span>
                </div>
            </div>
            <div class="col-md-6">
                <h5>${property.location}</h5>
                <p class="text-muted">${property.description}</p>

                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </div>
                    <div class="col-6">
                        <strong>Guests:</strong> ${property.maxGuests}
                    </div>
                    <div class="col-6">
                        <strong>Bedrooms:</strong> ${property.bedrooms}
                    </div>
                    <div class="col-6">
                        <strong>Bathrooms:</strong> ${property.bathrooms}
                    </div>
                </div>

                <h6>Amenities:</h6>
                <div class="mb-3">
                    ${property.amenities.map(amenity => `
                        <span class="badge bg-light text-dark me-1 mb-1">
                            <i class="fas fa-${getAmenityIcon(amenity)} me-1"></i>${amenity}
                        </span>
                    `).join('')}
                </div>

                <div class="price-info bg-light p-3 rounded">
                    <h4 class="text-primary mb-0">$${property.price} <small class="text-muted">per night</small></h4>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modalPropertyContent').innerHTML = modalContent;
    modal.show();
}

function toggleFavorite(propertyId) {
    const heartIcon = document.getElementById(`heart-${propertyId}`);

    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#dc3545';
        showAlert('Added to favorites!', 'success');
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        heartIcon.style.color = '';
        showAlert('Removed from favorites', 'info');
    }
}

function bookProperty() {
    const userData = localStorage.getItem('user');

    if (!userData) {
        showAlert('Please log in to book a property', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    showAlert('Booking feature would be implemented here', 'info');
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} custom-alert position-fixed`;
    alert.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'danger': return 'exclamation-circle';
        case 'info':
        default: return 'info-circle';
    }
}

window.changeGuests = changeGuests;
window.applyFilters = applyFilters;
window.clearAllFilters = clearAllFilters;
window.toggleView = toggleView;
window.showPropertyDetails = showPropertyDetails;
window.toggleFavorite = toggleFavorite;
window.bookProperty = bookProperty;
window.changePage = changePage;