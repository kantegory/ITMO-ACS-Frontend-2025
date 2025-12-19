import { initNavbar } from '../core/navbar.js';
import { createProperty, propertyTypeMap, rentalTypeMap } from '../api/properties.api.js';
import { authSession } from '../auth/auth.session.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initForm();
});

function initForm() {
    const propertyTypeSelect = document.getElementById('propertyType');
    const rentalTypeSelect = document.getElementById('rentalType');

    if (propertyTypeSelect) {
        Object.entries(propertyTypeMap).forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            propertyTypeSelect.appendChild(option);
        });
    }

    if (rentalTypeSelect) {
        Object.entries(rentalTypeMap).forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            rentalTypeSelect.appendChild(option);
        });
        rentalTypeSelect.addEventListener('change', updatePriceUnit);
        updatePriceUnit();
    }

    const user = authSession.getUser();
    if (user) {
        const contactEmail = document.getElementById('contactEmail');
        if (contactEmail && !contactEmail.value) {
            contactEmail.value = user.email;
        }
    }

    const form = document.getElementById('addPropertyForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function updatePriceUnit() {
    const rentalTypeSelect = document.getElementById('rentalType');
    const priceUnitSpan = document.getElementById('priceUnit');
    if (!rentalTypeSelect || !priceUnitSpan) return;

    const type = rentalTypeSelect.value;
    let unit = '₽';
    switch(type) {
        case 'daily': unit = '₽/день'; break;
        case 'monthly': unit = '₽/месяц'; break;
        case 'yearly': unit = '₽/год'; break;
    }
    priceUnitSpan.textContent = unit;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('addPropertyForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const formData = {
        title: document.getElementById('propertyTitle').value.trim(),
        location: document.getElementById('propertyLocation').value.trim(),
        description: document.getElementById('propertyDescription').value.trim(),
        propertyType: document.getElementById('propertyType').value,
        rentalType: document.getElementById('rentalType').value,
        price: parseFloat(document.getElementById('propertyPrice').value),
    };

    if (formData.price <= 0) {
        showMessage('Стоимость должна быть больше 0', 'danger');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Создание...';

    try {
        await createProperty(formData);
        showMessage('Объект недвижимости успешно создан!', 'success');
        setTimeout(() => window.location.href = 'profile.html', 1500);
    } catch (err) {
        console.error(err);
        showMessage(`Ошибка создания объекта: ${err.message}`, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function showMessage(msg, type = 'info') {
    const el = document.getElementById('formMessage');
    if (!el) return;
    el.textContent = msg;
    el.className = `alert alert-${type} mt-3`;
    el.classList.remove('d-none');

    if (type !== 'danger') {
        setTimeout(() => el.classList.add('d-none'), 5000);
    }
}