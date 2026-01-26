function handleAddPropertyForm(event) {
    event.preventDefault();

    if (!isAuthenticated()) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    const formData = {
        title: document.getElementById('propertyTitle').value.trim(),
        description: document.getElementById('propertyDescription').value.trim(),
        propertyType: document.getElementById('propertyType').value,
        rentalType: document.getElementById('rentalType').value,
        location: document.getElementById('propertyLocation').value.trim(),
        price: parseInt(document.getElementById('propertyPrice').value),
        area: document.getElementById('propertyArea').value ? parseInt(document.getElementById('propertyArea').value) : null,
        rooms: document.getElementById('propertyRooms').value ? parseInt(document.getElementById('propertyRooms').value) : null
    };

    if (!formData.title || !formData.description || !formData.propertyType ||
        !formData.rentalType || !formData.location || !formData.price) {
        alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
        return;
    }

    if (formData.price <= 0) {
        alert('Цена должна быть положительным числом');
        return;
    }

    const amenities = [];
    const amenityCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    amenityCheckboxes.forEach(checkbox => {
        amenities.push(checkbox.value);
    });

    const imageUrl = document.getElementById('propertyImage').value.trim();
    const images = imageUrl ? [imageUrl] : [];

    const user = authManager.getCurrentUser();
    const newProperty = createProperty({
        ...formData,
        amenities: amenities,
        images: images,
        ownerId: user.id
    });

    if (newProperty) {
        alert('Объект успешно добавлен!');
        window.location.href = 'profile.html';
    } else {
        alert('Ошибка при добавлении объекта');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const addPropertyForm = document.getElementById('addPropertyForm');
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', handleAddPropertyForm);
    }

    console.log('Страница добавления объекта загружена');
});

window.handleAddPropertyForm = handleAddPropertyForm;