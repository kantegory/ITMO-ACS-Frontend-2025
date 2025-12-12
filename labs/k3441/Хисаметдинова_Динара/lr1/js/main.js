let rooms = 1;
let adults = 1;
let children = 0;
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateGuestsDisplay();
    initializeFilters();
    initializeCarousel();
    setupDateInputs();
});

function initializeEventListeners() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterDestinations(this.dataset.filter);
            updateActiveFilter(this);
        });
    });

    const heartButtons = document.querySelectorAll('.fa-heart');
    heartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(this);
        });
    });

    const searchForm = document.getElementById('searchForm');
    console.log('Searching for searchForm:', searchForm);
    if (searchForm) {
        console.log('Adding event listener to searchForm');
        searchForm.addEventListener('submit', handleSearch);
    } else {
        console.error('searchForm not found!');
    }

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    });
}

function searchProperties(locationParam, checkInParam, checkOutParam) {
    const location = locationParam || document.getElementById('mainLocation').value;
    const checkIn = checkInParam || document.getElementById('mainCheckIn').value;
    const checkOut = checkOutParam || document.getElementById('mainCheckOut').value;

    console.log('Form values extracted:', { location, checkIn, checkOut, rooms, adults, children });

    if (!checkIn || !checkOut) {
        showAlert('Please select check-in and check-out dates', 'warning');
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        showAlert('Check-out date must be after check-in date', 'warning');
        return;
    }

    const searchButton = document.querySelector('#searchForm button[type="submit"]');
    if (searchButton) {
        searchButton.classList.add('loading');
        searchButton.disabled = true;
    }

    setTimeout(() => {
        if (searchButton) {
            searchButton.classList.remove('loading');
            searchButton.disabled = false;
        }

        const params = new URLSearchParams();
        params.set('checkIn', checkIn);
        params.set('checkOut', checkOut);
        params.set('adults', adults);
        params.set('children', children);
        params.set('rooms', rooms);

        if (location && location.trim()) {
            params.set('location', location.trim());
        }

        const paramsString = params.toString();
        const finalUrl = `search.html${paramsString ? '?' + paramsString : ''}`;
        console.log('Params string:', paramsString);
        console.log('Final URL:', finalUrl);
        console.log('Parameters being sent:', Object.fromEntries(params));
        console.log('About to redirect to:', finalUrl);
        window.location.href = finalUrl;
    }, 1500);
}

function handleSearch(e) {
    console.log('handleSearch called!', e);
    e.preventDefault();

    const formData = new FormData(e.target);
    const location = formData.get('location') || '';
    const checkIn = formData.get('checkIn') || '';
    const checkOut = formData.get('checkOut') || '';

    console.log('FormData extracted:', { location, checkIn, checkOut });
    console.log('Global guest variables:', { rooms, adults, children });
    console.log('All form entries:', Array.from(formData.entries()));

    searchProperties(location, checkIn, checkOut);
}

function increaseGuests(type) {
    switch(type) {
        case 'rooms':
            if (rooms < 10) rooms++;
            break;
        case 'adults':
            if (adults < 20) adults++;
            break;
        case 'children':
            if (children < 10) children++;
            break;
    }
    updateGuestsDisplay();
}

function decreaseGuests(type) {
    switch(type) {
        case 'rooms':
            if (rooms > 1) rooms--;
            break;
        case 'adults':
            if (adults > 1) adults--;
            break;
        case 'children':
            if (children > 0) children--;
            break;
    }
    updateGuestsDisplay();
}

function updateGuestsDisplay() {
    document.getElementById('roomsCount').textContent = rooms;
    document.getElementById('adultsCount').textContent = adults;
    document.getElementById('childrenCount').textContent = children;

    const guestsButton = document.querySelector('[data-bs-target="#guestsModal"]');
    if (guestsButton) {
        const roomText = rooms === 1 ? 'room' : 'rooms';
        const adultText = adults === 1 ? 'adult' : 'adults';
        const childText = children === 0 ? '0 children' : children === 1 ? '1 child' : `${children} children`;

        guestsButton.textContent = `${rooms} ${roomText}, ${adults} ${adultText}, ${childText}`;
    }
}

function filterDestinations(filter) {
    const cards = document.querySelectorAll('.destination-card');

    cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.classList.add('animate-fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

function updateActiveFilter(activeButton) {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.classList.remove('active', 'btn-dark');
        button.classList.add('btn-outline-secondary');
    });

    activeButton.classList.remove('btn-outline-secondary');
    activeButton.classList.add('active', 'btn-dark');
}

function initializeFilters() {
    filterDestinations('all');
}

function toggleFavorite(heartIcon) {
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

function initializeCarousel() {
    const dealsContainer = document.getElementById('dealsContainer');
    const prevButton = document.getElementById('prevDeals');
    const nextButton = document.getElementById('nextDeals');

    if (!dealsContainer) return;

    let currentIndex = 0;
    const cardWidth = dealsContainer.children[0]?.offsetWidth + 20;
    const maxIndex = Math.max(0, dealsContainer.children.length - 4);

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    function updateCarousel() {
        const translateX = -currentIndex * cardWidth;
        dealsContainer.style.transform = `translateX(${translateX}px)`;

        if (prevButton) prevButton.disabled = currentIndex === 0;
        if (nextButton) nextButton.disabled = currentIndex === maxIndex;
    }

    updateCarousel();
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

function showLoadingScreen(show = true) {
    let loadingScreen = document.getElementById('loadingScreen');

    if (show && !loadingScreen) {
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.innerHTML = `
            <div class="d-flex justify-content-center align-items-center position-fixed w-100 h-100"
                 style="top: 0; left: 0; background: rgba(255,255,255,0.9); z-index: 9999;">
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Searching for the best deals...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loadingScreen);
    } else if (!show && loadingScreen) {
        loadingScreen.remove();
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function handlePropertyClick(propertyId) {
    window.location.href = `property.html?id=${propertyId}`;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();

    const propertyCards = document.querySelectorAll('.card');
    propertyCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('.fa-heart')) {
                const propertyId = card.getAttribute('data-property-id') || (index + 1);
                handlePropertyClick(propertyId);
            }
        });
    });
});

function setupDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('mainCheckIn');
    const checkOutInput = document.getElementById('mainCheckOut');


    if (checkInInput && checkOutInput) {
        checkInInput.min = today;
        checkOutInput.min = today;

        checkInInput.addEventListener('change', function() {
            const selectedDate = this.value;
            if (selectedDate) {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutInput.min = nextDay.toISOString().split('T')[0];

                if (checkOutInput.value && checkOutInput.value <= selectedDate) {
                    checkOutInput.value = '';
                }
            }
        });
    }
}

window.searchProperties = searchProperties;
window.increaseGuests = increaseGuests;
window.decreaseGuests = decreaseGuests;