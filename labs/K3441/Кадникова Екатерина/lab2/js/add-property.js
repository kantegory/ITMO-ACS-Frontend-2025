import { initNavbar } from './navbar.js';
import { createProperty, propertyTypeMap, rentalTypeMap } from './properties.js';
import { getCurrentUserFromStorage } from './auth.js';

let amenities = [];
let selectedImages = [];

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initForm();
    setupEventListeners();
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
    }

    const user = getCurrentUserFromStorage();
    if (user) {
        const contactEmail = document.getElementById('contactEmail');
        if (contactEmail && !contactEmail.value) {
            contactEmail.value = user.email;
        }
    }

    if (rentalTypeSelect) {
        rentalTypeSelect.addEventListener('change', updatePriceUnit);
        updatePriceUnit();
    }
}

function setupEventListeners() {
    const form = document.getElementById('addPropertyForm');
    const addAmenityBtn = document.getElementById('addAmenityBtn');
    const propertyImagesInput = document.getElementById('propertyImages');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (addAmenityBtn) {
        addAmenityBtn.addEventListener('click', addAmenity);
    }

    if (propertyImagesInput) {
        propertyImagesInput.addEventListener('change', handleImageUpload);
    }

    const amenitiesInput = document.getElementById('propertyAmenities');
    if (amenitiesInput) {
        amenitiesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addAmenity();
            }
        });
    }
}

function updatePriceUnit() {
    const rentalTypeSelect = document.getElementById('rentalType');
    const priceUnitSpan = document.getElementById('priceUnit');

    if (!rentalTypeSelect || !priceUnitSpan) return;

    const selectedType = rentalTypeSelect.value;
    let unit = '₽';

    switch(selectedType) {
        case 'daily':
            unit = '₽/день';
            break;
        case 'monthly':
            unit = '₽/месяц';
            break;
        case 'yearly':
            unit = '₽/год';
            break;
    }

    priceUnitSpan.textContent = unit;
}

function addAmenity() {
    const input = document.getElementById('propertyAmenities');
    const amenitiesList = document.getElementById('amenitiesList');

    if (!input || !amenitiesList) return;

    const amenity = input.value.trim();
    if (!amenity) return;

    if (amenities.includes(amenity)) {
        showMessage('Такое удобство уже добавлено', 'warning');
        return;
    }

    amenities.push(amenity);

    const tag = document.createElement('div');
    tag.className = 'amenity-tag';
    tag.innerHTML = `
        ${amenity}
        <button type="button" class="btn btn-sm btn-link p-0" data-amenity="${amenity}">
            <i class="bi bi-x"></i>
        </button>
    `;

    amenitiesList.appendChild(tag);

    input.value = '';
    input.focus();

    const removeBtn = tag.querySelector('button');
    if (removeBtn) {
        removeBtn.addEventListener('click', removeAmenity);
    }
}

function removeAmenity(e) {
    const amenity = e.currentTarget.getAttribute('data-amenity');
    const index = amenities.indexOf(amenity);

    if (index > -1) {
        amenities.splice(index, 1);
        e.currentTarget.closest('.amenity-tag').remove();
    }
}

function handleImageUpload(e) {
    const files = e.target.files;
    const previewContainer = document.getElementById('imagePreview');

    if (!previewContainer || !files || files.length === 0) return;

    previewContainer.innerHTML = '';

    if (files.length > 10) {
        showMessage('Можно загрузить не более 10 изображений', 'warning');
        return;
    }

    selectedImages = Array.from(files);

    selectedImages.forEach((file, index) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image-preview me-2 mb-2';
            img.style.maxWidth = '150px';
            img.style.maxHeight = '150px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            img.style.border = '2px solid #dee2e6';

            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.display = 'inline-block';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn btn-danger btn-sm';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '5px';
            removeBtn.style.right = '5px';
            removeBtn.style.width = '24px';
            removeBtn.style.height = '24px';
            removeBtn.style.padding = '0';
            removeBtn.style.borderRadius = '50%';
            removeBtn.innerHTML = '<i class="bi bi-x"></i>';
            removeBtn.dataset.index = index;

            removeBtn.addEventListener('click', removeImage);

            imgContainer.appendChild(img);
            imgContainer.appendChild(removeBtn);
            previewContainer.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(e) {
    const index = parseInt(e.currentTarget.dataset.index, 10);
    selectedImages.splice(index, 1);

    const previewContainer = document.getElementById('imagePreview');
    const fileInput = document.getElementById('propertyImages');

    if (previewContainer && fileInput) {
        previewContainer.innerHTML = '';

        if (selectedImages.length === 0) {
            previewContainer.innerHTML = `
                <div class="text-muted">
                    <i class="bi bi-image display-4 d-block mb-2"></i>
                    <p>Предпросмотр изображений появится здесь</p>
                </div>
            `;
            fileInput.value = '';
        } else {
            selectedImages.forEach((file, newIndex) => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'image-preview me-2 mb-2';
                    img.style.maxWidth = '150px';
                    img.style.maxHeight = '150px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '5px';
                    img.style.border = '2px solid #dee2e6';

                    const imgContainer = document.createElement('div');
                    imgContainer.style.position = 'relative';
                    imgContainer.style.display = 'inline-block';

                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'btn btn-danger btn-sm';
                    removeBtn.style.position = 'absolute';
                    removeBtn.style.top = '5px';
                    removeBtn.style.right = '5px';
                    removeBtn.style.width = '24px';
                    removeBtn.style.height = '24px';
                    removeBtn.style.padding = '0';
                    removeBtn.style.borderRadius = '50%';
                    removeBtn.innerHTML = '<i class="bi bi-x"></i>';
                    removeBtn.dataset.index = newIndex;

                    removeBtn.addEventListener('click', removeImage);

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    previewContainer.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            });
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = document.getElementById('addPropertyForm');
    if (!form.checkValidity()) {
        e.stopPropagation();
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
        area: document.getElementById('propertyArea').value ?
            parseInt(document.getElementById('propertyArea').value) : undefined,
        rooms: document.getElementById('propertyRooms').value ?
            parseInt(document.getElementById('propertyRooms').value) : undefined,
        amenities: amenities.length > 0 ? amenities : undefined,
        contactPhone: document.getElementById('contactPhone').value.trim() || undefined,
        contactEmail: document.getElementById('contactEmail').value.trim() || undefined
    };

    if (formData.price <= 0) {
        showMessage('Стоимость должна быть больше 0', 'danger');
        return;
    }

    if (formData.area && formData.area <= 0) {
        showMessage('Площадь должна быть больше 0', 'danger');
        return;
    }

    if (formData.rooms && formData.rooms <= 0) {
        showMessage('Количество комнат должно быть больше 0', 'danger');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Создание...';

    try {
        const property = await createProperty(formData);

        if (selectedImages.length > 0) {
            await uploadImages(property.id, selectedImages);
        }

        showMessage('Объект недвижимости успешно создан!', 'success');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);

    } catch (error) {
        console.error('Ошибка создания объекта:', error);
        showMessage(`Ошибка создания объекта: ${error.message}`, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function uploadImages(propertyId, images) {
    try {
        const formData = new FormData();

        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        console.log(`Загружено ${images.length} изображений для объекта ${propertyId}`);

    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
    }
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('formMessage');
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.className = `alert alert-${type} mt-3`;
    messageEl.classList.remove('d-none');

    if (type !== 'danger') {
        setTimeout(() => {
            messageEl.classList.add('d-none');
        }, 5000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export { initForm, handleFormSubmit, addAmenity, removeAmenity };