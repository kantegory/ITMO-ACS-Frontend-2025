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
    initializePriceSlider();
    initializeFilters();
    checkAuthentication();

    // Check if we should use geolocation-based search
    const urlParams = new URLSearchParams(window.location.search);
    const hasGeolocationHint = urlParams.get('useLocation') === 'true';
    const hasLocationParam = urlParams.get('location');

    console.log('Search page loaded. URL params:', {
        hasGeolocationHint,
        hasLocationParam,
        geolocationSupported: !!navigator.geolocation
    });

    if (hasGeolocationHint || (!hasLocationParam && navigator.geolocation)) {
        // Try to use geolocation-based search with external APIs
        setTimeout(async () => {
            try {
                console.log('Geolocation search triggered. hasGeolocationHint:', hasGeolocationHint);

                const shouldUseGeo = hasGeolocationHint ? true : confirm('Search for hotels near your current location?');

                if (shouldUseGeo) {
                    console.log('User confirmed geolocation usage');

                    // Get user location
                    console.log('Getting user location...');
                    const position = await ApiService.getUserLocation();
                    console.log('Position received:', position);

                    const locationInfo = await ApiService.reverseGeocode(position.latitude, position.longitude);
                    console.log('Location info:', locationInfo);

                    // Search hotels via external API
                    console.log('Searching hotels via external API...');
                    const result = await ApiService.searchHotelsNearLocation(
                        position.latitude,
                        position.longitude
                    );
                    console.log('API result:', result);
                    console.log('API result details:', {
                        success: result.success,
                        dataLength: result.data?.length,
                        source: result.source,
                        firstHotel: result.data?.[0]
                    });

                    if (result.success && result.data.length > 0) {
                        console.log('Rendering external properties...');

                        // Hide loading state first
                        hideLoading();

                        // Show external hotels instead of local data
                        renderExternalProperties(result.data, {
                            latitude: position.latitude,
                            longitude: position.longitude,
                            city: locationInfo.city,
                            country: locationInfo.country
                        });

                        // Show success message
                        document.querySelector('.results-title')?.insertAdjacentHTML('afterend',
                            `<div class="alert alert-success">✅ Found ${result.data.length} hotels near ${locationInfo.city} via external API! Source: ${result.data[0]?.source || 'external'}</div>`);
                    } else {
                        console.log('No external hotels found or API failed');
                        console.log('Falling back to local data with location context');

                        // Hide loading and show local properties with location context
                        hideLoading();

                        // Load local properties but update the title to show location
                        await loadProperties();

                        // Update title to show it's showing local data near the location
                        const resultsTitle = document.querySelector('.results-title');
                        if (resultsTitle && locationInfo) {
                            resultsTitle.textContent = `Properties near ${locationInfo.city}, ${locationInfo.country}`;
                        }

                        // Show info message
                        document.querySelector('.results-title')?.insertAdjacentHTML('afterend',
                            `<div class="alert alert-info">⚠️ No hotels found via external API near ${locationInfo.city}. Showing available properties from our database.</div>`);
                    }
                } else {
                    loadProperties();
                }
            } catch (error) {
                console.error('Geolocation search failed:', error);
                hideLoading();
                loadProperties();
            }
        }, 1000);
    } else {
        loadProperties();
    }
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

async function loadProperties() {
    try {
        const result = await ApiService.getProperties();

        if (result.success) {
            properties = result.data;
        } else {
            properties = [...sampleProperties];
            console.warn('API failed, using sample data:', result.message);
        }

        applyFilters();
        hideLoading();
    } catch (error) {
        console.error('Error loading properties:', error);
        properties = [...sampleProperties];
        applyFilters();
        hideLoading();
    }
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
        item.addEventListener('click', async function(e) {
            e.preventDefault();
            currentSort = this.dataset.sort;
            document.getElementById('sortBtn').innerHTML =
                `<i class="fas fa-sort me-2"></i>Sort by: ${this.textContent}`;
            await sortAndRenderProperties();
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

async function applyFilters() {
    const apiFilters = {
        location: filters.location,
        type: filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : null,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
    };

    try {
        const result = await ApiService.getProperties(apiFilters);

        if (result.success) {
            filteredProperties = result.data.filter(property => {
                if (filters.propertyTypes.length > 1 && !filters.propertyTypes.includes(property.type)) {
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
        } else {
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
        }
    } catch (error) {
        console.error('Error applying filters:', error);
        filteredProperties = properties;
    }

    await sortAndRenderProperties();
    updateResultsCount();
}

async function sortAndRenderProperties() {
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

    await renderProperties();
    renderPagination();
}

async function renderProperties() {
    console.log('renderProperties called. filteredProperties.length:', filteredProperties.length);

    const propertyGrid = document.getElementById('propertyGrid');
    const noResults = document.getElementById('noResults');

    console.log('Elements found:', {
        propertyGrid: !!propertyGrid,
        noResults: !!noResults
    });

    if (filteredProperties.length === 0) {
        console.log('No properties to render - showing noResults');
        propertyGrid.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }

    console.log('Properties found, hiding noResults and rendering...');
    noResults.classList.add('d-none');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProperties = filteredProperties.slice(startIndex, endIndex);

    console.log('Page properties to render:', pageProperties.length);

    // Resolve image URLs for hotels
    const propertiesWithImages = await Promise.all(pageProperties.map(async (property) => {
        let imageUrl = property.image;

        // If it's a hotel with API image reference, resolve the actual URL
        if (property.type === 'hotel' && property.image.includes('/images/')) {
            try {
                imageUrl = await ApiService.resolveImageUrl(property.image);
            } catch (error) {
                console.warn('Failed to resolve image for', property.title, error);
                // Fallback to imageUrl if available
                imageUrl = property.imageUrl || property.image;
            }
        }

        return { ...property, resolvedImageUrl: imageUrl };
    }));

    const propertiesHTML = propertiesWithImages.map(property => `
        <div class="property-card card shadow-sm" onclick="showPropertyDetails('${property.id}')">
            <div class="position-relative">
                <img src="${property.resolvedImageUrl}" alt="${property.title}" class="card-img-top" style="height: 200px; object-fit: cover;"
                     onerror="this.src='${property.imageUrl || property.image}'">
                <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2" onclick="event.stopPropagation(); toggleFavorite('${property.id}')">
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

async function renderExternalProperties(externalHotels, userLocation) {
    console.log('renderExternalProperties called with:', {
        hotelsCount: externalHotels.length,
        firstHotel: externalHotels[0],
        userLocation
    });

    // Replace the current properties with external hotel data
    properties = externalHotels.map(hotel => ({
        id: hotel.id,
        title: hotel.name,
        location: hotel.location,
        type: hotel.type,
        price: hotel.price,
        rating: hotel.rating,
        reviews: Math.floor(Math.random() * 100) + 10, // Mock review count
        image: hotel.image,
        amenities: hotel.amenities || ['wifi', 'parking'],
        maxGuests: 4, // Default value for external hotels
        bedrooms: 1,
        bathrooms: 1,
        description: hotel.description,
        isExternal: true
    }));

    filteredProperties = [...properties];
    currentPage = 1;

    console.log('Properties mapped:', properties.length);
    console.log('Filtered properties:', filteredProperties.length);
    console.log('First mapped property:', properties[0]);

    // Update search result title
    const resultsTitle = document.querySelector('.results-title');
    if (resultsTitle && userLocation) {
        resultsTitle.textContent = `Hotels near ${userLocation.city}, ${userLocation.country}`;
    }

    // Update filter options to reflect external data
    updateFilterOptionsForExternal();

    console.log('About to call renderProperties...');
    await renderProperties();
    console.log('renderProperties completed');

    updateResultsCount();
    renderPagination();
}

function updateFilterOptionsForExternal() {
    // Update property type filter to include hotels
    const propertyTypeFilters = document.querySelectorAll('input[name="propertyType"]');
    propertyTypeFilters.forEach(checkbox => {
        if (checkbox.value === 'hotel') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });

    // Update price range to accommodate hotel prices
    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        priceSlider.max = 300; // Increase max price for hotels
        filters.maxPrice = 300;
    }
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

async function changePage(page) {
    currentPage = page;
    await renderProperties();
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
    const property = properties.find(p => p.id == propertyId);
    if (!property) {
        console.warn('Property not found with ID:', propertyId);
        return;
    }

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
window.renderExternalProperties = renderExternalProperties;