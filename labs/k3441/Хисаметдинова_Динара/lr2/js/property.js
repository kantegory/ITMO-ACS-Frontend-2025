let currentProperty = null;
let guests = { adults: 1, children: 0 };
let bookingData = {
    checkIn: '',
    checkOut: '',
    nights: 0,
    basePrice: 0,
    serviceFee: 0,
    total: 0
};

const propertyData = {
    1: {
        id: 1,
        title: 'Cozy Belgrade Apartment',
        location: 'Belgrade, Serbia',
        type: 'Apartment',
        price: 30,
        rating: 4.2,
        reviews: 47,
        images: [
            'images/cozy-belgrade-apartment.jpg'
        ],
        amenities: ['wifi', 'kitchen', 'parking', 'heating', 'tv'],
        maxGuests: 4,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Charming apartment in the heart of Belgrade with authentic Socialist architecture. Perfect for exploring the city\'s rich history and vibrant nightlife.',
        locationDescription: 'Located in the historic center of Belgrade, walking distance to major attractions, restaurants, and public transportation.',
        host: {
            name: 'Miloš',
            avatar: 'https://ui-avatars.com/api/?name=Miloš&background=007bff&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 3
        },
        reviews: [
            {
                id: 1,
                author: 'Sarah M.',
                rating: 5,
                date: '2025-01-15',
                text: 'Amazing place! Miloš was very helpful and the location is perfect. The apartment has everything you need.'
            },
            {
                id: 2,
                author: 'John D.',
                rating: 4,
                date: '2025-01-10',
                text: 'Great value for money. Clean and comfortable apartment. Would definitely stay again.'
            }
        ]
    },
    2: {
        id: 2,
        title: 'Modern Krakow Loft',
        location: 'Krakow, Poland',
        type: 'Loft',
        price: 225,
        rating: 4.8,
        reviews: 112,
        images: [
            'images/modern-krakow-loft.jpg',
            'images/property2.jpg',
            'images/property3.jpg'
        ],
        amenities: ['wifi', 'aircon', 'kitchen', 'washer'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Contemporary loft in historic Krakow with modern amenities and stunning views.',
        locationDescription: 'Prime location in Krakow Old Town, steps away from Market Square.',
        host: {
            name: 'Maria',
            avatar: 'https://ui-avatars.com/api/?name=Maria&background=28a745&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 2
        },
        reviews: []
    },
    3: {
        id: 3,
        title: 'Bucharest Studio',
        location: 'Bucharest, Romania',
        type: 'Studio',
        price: 24,
        rating: 3.9,
        reviews: 33,
        images: [
            'images/bucharest-studio.jpg',
            'images/property1.jpg'
        ],
        amenities: ['wifi', 'kitchen'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Affordable studio apartment perfect for short stays in Bucharest with modernist charm.',
        locationDescription: 'Central Bucharest location with easy access to metro and attractions.',
        host: {
            name: 'Alexandru',
            avatar: 'https://ui-avatars.com/api/?name=Alexandru&background=dc3545&color=fff&size=50',
            isSuperhost: false,
            yearsHosting: 1
        },
        reviews: []
    },
    4: {
        id: 4,
        title: 'Riga Luxury Suite',
        location: 'Riga, Latvia',
        type: 'Apartment',
        price: 190,
        rating: 4.6,
        reviews: 89,
        images: [
            'images/riga-luxury-suite.jpg',
            'images/property4.jpg'
        ],
        amenities: ['wifi', 'aircon', 'kitchen', 'washer', 'parking'],
        maxGuests: 6,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Luxurious apartment with Baltic Sea views in historic Riga featuring Soviet-era grandeur.',
        locationDescription: 'Premium location in Riga\'s Art Nouveau district.',
        host: {
            name: 'Dmitri',
            avatar: 'https://ui-avatars.com/api/?name=Dmitri&background=6f42c1&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 5
        },
        reviews: []
    },
    5: {
        id: 5,
        title: 'Prague Historic House',
        location: 'Prague, Czech Republic',
        type: 'House',
        price: 120,
        rating: 4.4,
        reviews: 67,
        images: [
            'images/prague-historic-house.jpg',
            'images/property5.jpg'
        ],
        amenities: ['wifi', 'kitchen', 'parking', 'washer'],
        maxGuests: 8,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Beautiful historic house in Prague with traditional architecture and modern comforts.',
        locationDescription: 'Historic Prague neighborhood, walking distance to Charles Bridge.',
        host: {
            name: 'Pavel',
            avatar: 'https://ui-avatars.com/api/?name=Pavel&background=fd7e14&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 4
        },
        reviews: []
    },
    6: {
        id: 6,
        title: 'Ljubljana Garden Apartment',
        location: 'Ljubljana, Slovenia',
        type: 'Apartment',
        price: 85,
        rating: 4.3,
        reviews: 29,
        images: [
            'images/ljubljana-garden-apartment.jpg',
            'images/property6.jpg'
        ],
        amenities: ['wifi', 'kitchen', 'washer', 'heating'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: 'Peaceful apartment with garden access in charming Ljubljana.',
        locationDescription: 'Green area of Ljubljana with easy access to city center.',
        host: {
            name: 'Ana',
            avatar: 'https://ui-avatars.com/api/?name=Ana&background=198754&color=fff&size=50',
            isSuperhost: false,
            yearsHosting: 2
        },
        reviews: []
    },
    7: {
        id: 7,
        title: 'Warsaw Modern Flat',
        location: 'Warsaw, Poland',
        type: 'Apartment',
        price: 95,
        rating: 4.1,
        reviews: 54,
        images: [
            'images/warsaw-modern-flat.jpg',
            'images/property3.jpg'
        ],
        amenities: ['wifi', 'aircon', 'kitchen', 'washer'],
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Modern flat in Warsaw with sleek design and all amenities.',
        locationDescription: 'Central Warsaw location near business district.',
        host: {
            name: 'Katarzyna',
            avatar: 'https://ui-avatars.com/api/?name=Katarzyna&background=e83e8c&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 3
        },
        reviews: []
    },
    8: {
        id: 8,
        title: 'Budapest Hotel Suite',
        location: 'Budapest, Hungary',
        type: 'Hotel',
        price: 140,
        rating: 4.7,
        reviews: 156,
        images: [
            'images/budapest-hotel.jpg',
            'images/property4.jpg'
        ],
        amenities: ['wifi', 'aircon', 'tv', 'parking'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Elegant hotel suite in the heart of Budapest with Danube views.',
        locationDescription: 'Prime Budapest location near thermal baths and parliament.',
        host: {
            name: 'Zoltán',
            avatar: 'https://ui-avatars.com/api/?name=Zoltán&background=20c997&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 6
        },
        reviews: []
    },
    9: {
        id: 9,
        title: 'Haludovo Palace Hotel',
        location: 'Krk Island, Primorje-Gorski Kotar County',
        type: 'Hotel',
        price: 175,
        rating: 4.0,
        reviews: 147,
        images: [
            'images/haludovo-palace.jpg'
        ],
        amenities: ['wifi', 'tv', 'parking', 'aircon'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Historic luxury hotel on beautiful Krk Island with stunning sea views.',
        locationDescription: 'Beachfront location on Krk Island with private beach access.',
        host: {
            name: 'Marina',
            avatar: 'https://ui-avatars.com/api/?name=Marina&background=17a2b8&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 8
        },
        reviews: []
    },
    10: {
        id: 10,
        title: 'Hotel Cherno More',
        location: 'Varna, Bulgaria',
        type: 'Hotel',
        price: 160,
        rating: 3.8,
        reviews: 52,
        images: [
            'images/cherno-more-hotel.jpg'
        ],
        amenities: ['wifi', 'tv', 'parking'],
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Classic hotel-casino in the heart of Varna with authentic Bulgarian hospitality.',
        locationDescription: 'Central Varna location near the Black Sea coast.',
        host: {
            name: 'Georgi',
            avatar: 'https://ui-avatars.com/api/?name=Georgi&background=ffc107&color=000&size=50',
            isSuperhost: false,
            yearsHosting: 4
        },
        reviews: []
    },
    11: {
        id: 11,
        title: 'Flat in Ferant Garden',
        location: 'Ljubljana, Slovenia',
        type: 'Apartment',
        price: 80,
        rating: 4.5,
        reviews: 89,
        images: [
            'images/flat-in-ferant-garden.jpg'
        ],
        amenities: ['wifi', 'kitchen', 'washer'],
        maxGuests: 3,
        bedrooms: 2,
        bathrooms: 1,
        description: 'Charming apartment in Ljubljana with garden access and peaceful surroundings.',
        locationDescription: 'Quiet residential area with easy access to city center.',
        host: {
            name: 'Petra',
            avatar: 'https://ui-avatars.com/api/?name=Petra&background=198754&color=fff&size=50',
            isSuperhost: true,
            yearsHosting: 3
        },
        reviews: []
    },
    12: {
        id: 12,
        title: 'Soviet Apartment',
        location: 'Bratislava, Slovakia',
        type: 'Apartment',
        price: 60,
        rating: 4.4,
        reviews: 73,
        images: [
            'images/soviet-apartment.jpg'
        ],
        amenities: ['wifi', 'kitchen', 'heating'],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: 'Authentic Soviet-era apartment with original architectural features and modern amenities.',
        locationDescription: 'Historic Bratislava neighborhood with authentic atmosphere.',
        host: {
            name: 'Viktor',
            avatar: 'https://ui-avatars.com/api/?name=Viktor&background=6f42c1&color=fff&size=50',
            isSuperhost: false,
            yearsHosting: 2
        },
        reviews: []
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeProperty();
    checkAuthentication();
    setupEventListeners();
});

function initializeProperty() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id') || '1';

    currentProperty = propertyData[propertyId];

    if (!currentProperty) {
        showAlert('Property not found', 'error');
        window.location.href = 'search.html';
        return;
    }

    loadPropertyData();
    setMinDate();
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

function setupEventListeners() {
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);

    document.getElementById('checkInInput').addEventListener('change', calculatePricing);
    document.getElementById('checkOutInput').addEventListener('change', calculatePricing);

    setupRatingInput();
}

function loadPropertyData() {
    if (!currentProperty) return;

    document.getElementById('propertyTitle').textContent = currentProperty.title;
    document.getElementById('propertyLocation').textContent = currentProperty.location;
    document.getElementById('ratingValue').textContent = currentProperty.rating;
    document.getElementById('reviewCount').textContent = `(${currentProperty.reviews.length} reviews)`;
    document.getElementById('propertyDescription').textContent = currentProperty.description;
    document.getElementById('maxGuests').textContent = currentProperty.maxGuests;
    document.getElementById('bedrooms').textContent = currentProperty.bedrooms;
    document.getElementById('bathrooms').textContent = currentProperty.bathrooms;
    document.getElementById('propertyType').textContent = currentProperty.type;
    document.getElementById('pricePerNight').textContent = `$${currentProperty.price}`;
    document.getElementById('locationDescription').textContent = currentProperty.locationDescription;

    const rating = currentProperty.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '★'.repeat(fullStars);
    if (hasHalfStar) starsHTML += '☆';
    starsHTML += '☆'.repeat(5 - Math.ceil(rating));
    document.getElementById('propertyRating').innerHTML = `<span class="text-warning">${starsHTML}</span>`;

    loadImages();

    loadAmenities();

    loadReviews();

    bookingData.basePrice = currentProperty.price;
}

function loadImages() {
    const carouselImages = document.getElementById('carouselImages');
    const galleryThumbnails = document.getElementById('galleryThumbnails');

    const carouselHTML = currentProperty.images.map((image, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${image}" class="d-block w-100 h-100" alt="Property image ${index + 1}" style="object-fit: cover;">
        </div>
    `).join('');

    carouselImages.innerHTML = carouselHTML;

    const thumbnailHTML = currentProperty.images.slice(0, 6).map((image, index) => `
        <div class="col-md-2 col-4">
            <img src="${image}" alt="Thumbnail ${index + 1}"
                 class="img-fluid rounded property-gallery-thumb"
                 onclick="showImageModal('${image}')">
        </div>
    `).join('');

    galleryThumbnails.innerHTML = thumbnailHTML;
}

function loadAmenities() {
    const amenitiesList = document.getElementById('amenitiesList');

    const amenityIcons = {
        wifi: 'fas fa-wifi',
        kitchen: 'fas fa-utensils',
        parking: 'fas fa-parking',
        aircon: 'fas fa-snowflake',
        washer: 'fas fa-tshirt',
        heating: 'fas fa-thermometer-half',
        tv: 'fas fa-tv'
    };

    const amenityNames = {
        wifi: 'WiFi',
        kitchen: 'Kitchen',
        parking: 'Free Parking',
        aircon: 'Air Conditioning',
        washer: 'Washer',
        heating: 'Heating',
        tv: 'Television'
    };

    const amenitiesHTML = currentProperty.amenities.map(amenity => `
        <div class="col-md-6">
            <div class="d-flex align-items-center">
                <div class="amenity-icon bg-primary bg-opacity-10 text-primary me-3">
                    <i class="${amenityIcons[amenity] || 'fas fa-check'}"></i>
                </div>
                <span>${amenityNames[amenity] || amenity}</span>
            </div>
        </div>
    `).join('');

    amenitiesList.innerHTML = amenitiesHTML;
}

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');

    if (currentProperty.reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                <p class="text-muted">No reviews yet. Be the first to review!</p>
            </div>
        `;
        return;
    }

    const reviewsHTML = currentProperty.reviews.map(review => {
        let avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=007bff&color=fff&size=40`;

        if (review.author === 'Sarah M.') {
            avatarSrc = 'images/avatar-sarah.jpg';
        } else if (review.author === 'John D.') {
            avatarSrc = 'images/avatar-john.jpg';
        }

        return `
        <div class="review-item border-bottom pb-3 mb-3">
            <div class="d-flex align-items-start">
                <img src="${avatarSrc}"
                     alt="${review.author}" class="rounded-circle me-3" width="40" height="40">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">${review.author}</h6>
                        <small class="text-muted">${formatDate(review.date)}</small>
                    </div>
                    <div class="text-warning mb-2">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <p class="mb-0">${review.text}</p>
                </div>
            </div>
        </div>
        `;
    }).join('');

    reviewsList.innerHTML = reviewsHTML;
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInInput').min = today;
    document.getElementById('checkOutInput').min = today;
}

function calculatePricing() {
    const checkIn = document.getElementById('checkInInput').value;
    const checkOut = document.getElementById('checkOutInput').value;

    if (!checkIn || !checkOut) {
        document.getElementById('pricingBreakdown').style.display = 'none';
        document.getElementById('bookButton').textContent = 'Check Availability';
        return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
        showAlert('Check-out date must be after check-in date', 'warning');
        return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const baseTotal = nights * bookingData.basePrice;
    const serviceFee = Math.round(baseTotal * 0.1);
    const total = baseTotal + serviceFee;

    bookingData.checkIn = checkIn;
    bookingData.checkOut = checkOut;
    bookingData.nights = nights;
    bookingData.serviceFee = serviceFee;
    bookingData.total = total;

    document.getElementById('nightlyRate').textContent = `$${bookingData.basePrice} x ${nights} nights`;
    document.getElementById('nightlyTotal').textContent = `$${baseTotal}`;
    document.getElementById('serviceFee').textContent = `$${serviceFee}`;
    document.getElementById('totalPrice').textContent = `$${total}`;
    document.getElementById('pricingBreakdown').style.display = 'block';
    document.getElementById('bookButton').textContent = 'Reserve';
}

function handleBooking(e) {
    e.preventDefault();

    const userData = localStorage.getItem('user');

    if (!userData) {
        showAlert('Please log in to make a booking', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
        showAlert('Please select your check-in and check-out dates', 'warning');
        return;
    }

    if (guests.adults + guests.children > currentProperty.maxGuests) {
        showAlert(`This property can accommodate maximum ${currentProperty.maxGuests} guests`, 'warning');
        return;
    }

    showBookingConfirmation();
}

function showBookingConfirmation() {
    const confirmationHTML = `
        <div class="modal fade" id="bookingConfirmationModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Your Booking</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${currentProperty.images[0]}" alt="${currentProperty.title}"
                                     class="img-fluid rounded">
                            </div>
                            <div class="col-md-8">
                                <h6>${currentProperty.title}</h6>
                                <p class="text-muted small">${currentProperty.location}</p>

                                <div class="booking-details mt-3">
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>Check-in:</span>
                                        <span>${formatDate(bookingData.checkIn)}</span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>Check-out:</span>
                                        <span>${formatDate(bookingData.checkOut)}</span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>Guests:</span>
                                        <span>${guests.adults + guests.children}</span>
                                    </div>
                                    <div class="d-flex justify-content-between mb-1">
                                        <span>Nights:</span>
                                        <span>${bookingData.nights}</span>
                                    </div>
                                    <hr>
                                    <div class="d-flex justify-content-between fw-bold">
                                        <span>Total:</span>
                                        <span>$${bookingData.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="confirmBooking()">Confirm Booking</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    const modal = new bootstrap.Modal(document.getElementById('bookingConfirmationModal'));
    modal.show();

    modal._element.addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function confirmBooking() {
    showAlert('Booking confirmed! Check your profile for details.', 'success');

    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingConfirmationModal'));
    modal.hide();

    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

function changeGuests(type, delta) {
    if (type === 'adults') {
        guests.adults = Math.max(1, guests.adults + delta);
        guests.adults = Math.min(currentProperty.maxGuests, guests.adults);
        document.getElementById('adultsCount').textContent = guests.adults;
    } else if (type === 'children') {
        guests.children = Math.max(0, guests.children + delta);
        guests.children = Math.min(currentProperty.maxGuests - guests.adults, guests.children);
        document.getElementById('childrenCount').textContent = guests.children;
    }
}

function updateGuestsDisplay() {
    const total = guests.adults + guests.children;
    const adultText = guests.adults === 1 ? 'adult' : 'adults';
    const childText = guests.children === 0 ? '' : guests.children === 1 ? ', 1 child' : `, ${guests.children} children`;

    document.getElementById('guestsDisplay').textContent = `${guests.adults} ${adultText}${childText}`;

    if (total > currentProperty.maxGuests) {
        showAlert(`Maximum ${currentProperty.maxGuests} guests allowed`, 'warning');
    }
}

function toggleFavorite() {
    const favoriteIcon = document.getElementById('favoriteIcon');

    if (favoriteIcon.classList.contains('far')) {
        favoriteIcon.classList.remove('far');
        favoriteIcon.classList.add('fas');
        favoriteIcon.style.color = '#dc3545';
        showAlert('Added to favorites!', 'success');
    } else {
        favoriteIcon.classList.remove('fas');
        favoriteIcon.classList.add('far');
        favoriteIcon.style.color = '';
        showAlert('Removed from favorites', 'info');
    }
}

function shareProperty() {
    if (navigator.share) {
        navigator.share({
            title: currentProperty.title,
            text: currentProperty.description,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showAlert('Link copied to clipboard!', 'success');
        });
    }
}

function showAllReviews() {
    showAlert('All reviews page would open here', 'info');
}

function writeReview() {
    const userData = localStorage.getItem('user');

    if (!userData) {
        showAlert('Please log in to write a review', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

function setupRatingInput() {
    const style = document.createElement('style');
    style.textContent = `
        .rating-input {
            direction: rtl;
            display: flex;
            justify-content: flex-end;
        }
        .rating-input input[type="radio"] {
            display: none;
        }
        .rating-input label {
            color: #ddd;
            font-size: 2rem;
            padding: 0 0.1rem;
            cursor: pointer;
            transition: color 0.2s;
        }
        .rating-input label:hover,
        .rating-input label:hover ~ label,
        .rating-input input[type="radio"]:checked ~ label {
            color: #ffc107;
        }
    `;
    document.head.appendChild(style);
}

function submitReview() {
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const text = document.getElementById('reviewText').value;

    if (!rating || !text.trim()) {
        showAlert('Please provide both a rating and review text', 'warning');
        return;
    }

    showAlert('Review submitted successfully!', 'success');

    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    modal.hide();
    document.getElementById('reviewForm').reset();
}

function contactHost() {
    const userData = localStorage.getItem('user');

    if (!userData) {
        showAlert('Please log in to contact the host', 'warning');
        return;
    }

    window.location.href = 'messages.html?host=' + encodeURIComponent(currentProperty.host.name);
}

function reportProperty() {
    showAlert('Report functionality would be implemented here', 'info');
}

function showImageModal(imageSrc) {
    const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-body p-0">
                        <img src="${imageSrc}" alt="Property image" class="img-fluid w-100">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();

    modal._element.addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        case 'error':
        case 'danger': return 'exclamation-circle';
        case 'info':
        default: return 'info-circle';
    }
}

window.changeGuests = changeGuests;
window.updateGuestsDisplay = updateGuestsDisplay;
window.toggleFavorite = toggleFavorite;
window.shareProperty = shareProperty;
window.showAllReviews = showAllReviews;
window.writeReview = writeReview;
window.submitReview = submitReview;
window.contactHost = contactHost;
window.reportProperty = reportProperty;
window.showImageModal = showImageModal;
window.confirmBooking = confirmBooking;