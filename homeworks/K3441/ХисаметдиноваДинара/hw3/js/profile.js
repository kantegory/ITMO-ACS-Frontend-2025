
let currentUser = null;

let profileData = {
    bookings: [],
    savedProperties: [],
    recentActivity: [],
    stats: {
        activeBookings: 0,
        completedStays: 0,
        savedProperties: 0,
        unreadMessages: 0
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadUserData();
    loadDashboardData();
});

function initializeDashboard() {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userData);

    updateUserDisplay();

    initializeEventListeners();
}

function loadUserData() {
    if (currentUser) {
        document.getElementById('userDisplayName').textContent =
            currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.email;
        document.getElementById('welcomeName').textContent =
            currentUser.firstName || 'User';

        const avatar = document.querySelector('.dropdown img');
        if (avatar && currentUser.firstName && currentUser.lastName) {
            const name = `${currentUser.firstName}+${currentUser.lastName}`;
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=007bff&color=fff&size=32`;
        }
    }
}

function loadDashboardData() {
    setTimeout(() => {
        loadSampleData();
        updateStats();
        renderCurrentBookings();
        renderSavedProperties();
        renderRecentActivity();
    }, 500);
}

function loadSampleData() {
    const registrationTime = new Date(currentUser.registrationTime || currentUser.loginTime);
    const now = new Date();
    const timeSinceRegistration = now - registrationTime;

    if (timeSinceRegistration > 300000) { // 5 minutes
        profileData.stats.completedStays = Math.floor(Math.random() * 3) + 1;
        profileData.stats.savedProperties = Math.floor(Math.random() * 5) + 2;
        profileData.stats.unreadMessages = Math.floor(Math.random() * 3);
    }

    profileData.recentActivity.push({
        id: 1,
        type: 'welcome',
        title: 'Welcome to RentAparts!',
        description: 'Your account has been created successfully. Start exploring unique stays across Eastern Europe.',
        time: 'Just now',
        icon: 'fas fa-user-plus',
        color: 'primary'
    });

    if (profileData.stats.savedProperties > 0) {
        profileData.recentActivity.unshift({
            id: 2,
            type: 'saved',
            title: 'Property Saved',
            description: 'You saved a property in Belgrade, Serbia',
            time: '2 hours ago',
            icon: 'fas fa-heart',
            color: 'danger'
        });
    }
}

function updateStats() {
    document.getElementById('activeBookings').textContent = profileData.stats.activeBookings;
    document.getElementById('completedStays').textContent = profileData.stats.completedStays;
    document.getElementById('savedProperties').textContent = profileData.stats.savedProperties;
    document.getElementById('unreadMessages').textContent = profileData.stats.unreadMessages;
}

function renderCurrentBookings() {
    const container = document.getElementById('currentBookingsContainer');

    if (profileData.bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No current bookings</p>
                <button class="btn btn-primary" onclick="window.location.href='search.html'">
                    Start Exploring
                </button>
            </div>
        `;
        return;
    }

    const bookingsHTML = profileData.bookings.map(booking => `
        <div class="booking-item border rounded p-3 mb-3">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <img src="${booking.image}" alt="${booking.title}"
                         class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                </div>
                <div class="col-md-6">
                    <h6 class="mb-1">${booking.title}</h6>
                    <p class="text-muted small mb-1">${booking.location}</p>
                    <p class="small mb-0">
                        <i class="fas fa-calendar me-1"></i>
                        ${booking.checkIn} - ${booking.checkOut}
                    </p>
                </div>
                <div class="col-md-3 text-md-end">
                    <span class="badge bg-${booking.statusColor} mb-2">${booking.status}</span>
                    <p class="fw-bold mb-0">${booking.total}</p>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = bookingsHTML;
}

function renderSavedProperties() {
    const container = document.getElementById('savedPropertiesContainer');

    if (profileData.stats.savedProperties === 0) {
        container.innerHTML = `
            <div class="text-center py-3">
                <i class="far fa-heart fa-2x text-muted mb-2"></i>
                <p class="text-muted small mb-0">No saved properties yet</p>
            </div>
        `;
        return;
    }

    const savedProperties = [
        {
            title: 'Belgrade Apartment',
            location: 'Belgrade, Serbia',
            price: '$30/night',
            image: 'images/property1.jpg'
        },
        {
            title: 'Krakow Loft',
            location: 'Krakow, Poland',
            price: '$225/night',
            image: 'images/property2.jpg'
        }
    ];

    const propertiesHTML = savedProperties.slice(0, 3).map(property => `
        <div class="saved-property-item d-flex mb-3">
            <img src="${property.image}" alt="${property.title}"
                 class="rounded me-2" style="width: 60px; height: 40px; object-fit: cover;">
            <div class="flex-grow-1">
                <h6 class="mb-0 small">${property.title}</h6>
                <p class="text-muted small mb-0">${property.location}</p>
                <p class="text-primary small mb-0"><strong>${property.price}</strong></p>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeSavedProperty('${property.title}')">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `).join('');

    container.innerHTML = propertiesHTML;
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivityContainer');

    const activitiesHTML = profileData.recentActivity.map(activity => `
        <div class="activity-item d-flex align-items-start mb-3">
            <div class="activity-icon bg-${activity.color} text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                 style="width: 40px; height: 40px;">
                <i class="${activity.icon}"></i>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${activity.title}</h6>
                <p class="text-muted small mb-0">${activity.description}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `).join('');

    container.innerHTML = activitiesHTML;
}

function initializeEventListeners() {
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.addEventListener('shown.bs.modal', loadProfileData);
    }
}

function updateUserDisplay() {
    const userElements = document.querySelectorAll('[data-user-field]');
    userElements.forEach(element => {
        const field = element.getAttribute('data-user-field');
        if (currentUser[field]) {
            element.textContent = currentUser[field];
        }
    });
}

function showProfileModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function loadProfileData() {
    if (currentUser) {
        document.getElementById('profileFirstName').value = currentUser.firstName || '';
        document.getElementById('profileLastName').value = currentUser.lastName || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
    }
}

function saveProfile() {
    const updatedData = {
        firstName: document.getElementById('profileFirstName').value,
        lastName: document.getElementById('profileLastName').value,
        phone: document.getElementById('profilePhone').value
    };

    Object.assign(currentUser, updatedData);

    localStorage.setItem('user', JSON.stringify(currentUser));

    loadUserData();

    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
    showAlert('Profile updated successfully!', 'success');
}

function showSupportModal() {
    const modal = new bootstrap.Modal(document.getElementById('supportModal'));
    modal.show();
}

function submitSupportRequest() {
    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;

    if (!subject || !message.trim()) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }

    setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('supportModal')).hide();
        showAlert('Support request submitted successfully! We\'ll get back to you soon.', 'success');

        document.getElementById('supportSubject').value = '';
        document.getElementById('supportMessage').value = '';
    }, 1000);
}

function showAllBookings() {
    showAlert('All bookings page would open here', 'info');
}

function removeSavedProperty(propertyTitle) {
    if (confirm(`Remove ${propertyTitle} from saved properties?`)) {
        profileData.stats.savedProperties = Math.max(0, profileData.stats.savedProperties - 1);
        updateStats();
        renderSavedProperties();
        showAlert('Property removed from saved list', 'info');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
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

function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

window.showProfileModal = showProfileModal;
window.saveProfile = saveProfile;
window.showSupportModal = showSupportModal;
window.submitSupportRequest = submitSupportRequest;
window.showAllBookings = showAllBookings;
window.removeSavedProperty = removeSavedProperty;
window.logout = logout;