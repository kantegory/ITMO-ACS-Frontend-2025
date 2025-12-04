import { isLoggedIn, getCurrentUser } from './session.js';
import { apiGet, apiPost } from './api.js';
import { logout } from './auth.js';
import { createProperty, updateProperty, deleteProperty } from './properties.js';

const TYPE_LABELS = {
    flat: 'Квартира',
    house: 'Дом',
    room: 'Комната'
};

const STATUS_LABELS = {
    available: 'Свободно',
    occupied: 'Занято',
    closed: 'Неактивно'
};

function formatType(type) {
    return TYPE_LABELS[type] || type || '—';
}

function formatStatus(status) {
    return STATUS_LABELS[status] || status || '—';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'signin.html';
        });
    }

    const me = getCurrentUser();
    const ownerId = me?.user_id;

    const listEl = document.getElementById('myPropertiesList');
    const emptyEl = document.getElementById('myPropertiesEmpty');
    const errorEl = document.getElementById('myPropertiesError');
    const openCreateBtn = document.getElementById('openCreateModalBtn');

    const propertyModalEl = document.getElementById('propertyModal');
    const deleteModalEl = document.getElementById('deletePropertyModal');

    const propertyModal =
        propertyModalEl && window.bootstrap
            ? new window.bootstrap.Modal(propertyModalEl)
            : null;

    const deleteModal =
        deleteModalEl && window.bootstrap
            ? new window.bootstrap.Modal(deleteModalEl)
            : null;

    const propertyForm = document.getElementById('propertyForm');
    const propertyIdInput = document.getElementById('propertyId');
    const propertyTitleInput = document.getElementById('propertyTitle');
    const propertyTypeSelect = document.getElementById('propertyType');
    const propertyStatusSelect = document.getElementById('propertyStatus');
    const propertyPriceInput = document.getElementById('propertyPrice');
    const propertyLocationInput = document.getElementById('propertyLocation');
    const propertyDescriptionInput = document.getElementById('propertyDescription');
    const propertyFeaturesInput = document.getElementById('propertyFeatures');
    const propertyRentalTermsInput = document.getElementById('propertyRentalTerms');
    const photoUrlsInput = document.getElementById('photoUrls');
    const propertyFormError = document.getElementById('propertyFormError');
    const propertyFormSubmitBtn = document.getElementById('propertyFormSubmitBtn');
    const propertyModalLabel = document.getElementById('propertyModalLabel');

    const deletePropertyTitleEl = document.getElementById('deletePropertyTitle');
    const confirmDeletePropertyBtn = document.getElementById('confirmDeletePropertyBtn');

    let currentDeleteId = null;

    async function loadMyProperties() {
        if (!ownerId || !listEl) return;

        emptyEl?.classList.add('d-none');
        errorEl?.classList.add('d-none');
        listEl.innerHTML = '<p class="text-muted">Загружаем ваши объявления...</p>';

        try {
            const data = await apiGet(`/properties?ownerId=${ownerId}`, { auth: true });
            const properties = Array.isArray(data) ? data : [];

            if (!properties.length) {
                listEl.innerHTML = '';
                emptyEl?.classList.remove('d-none');
                return;
            }

            const withPhotos = await Promise.all(
                properties.map(async p => {
                    try {
                        const photos = await apiGet(`/photos/by-property/${p.property_id}`, { auth: true });
                        const firstPhoto =
                            Array.isArray(photos) && photos.length > 0
                                ? photos[0].photo_url
                                : null;
                        return { ...p, main_photo_url: firstPhoto };
                    } catch (e) {
                        console.error('load photo error', e);
                        return { ...p, main_photo_url: null };
                    }
                })
            );

            renderPropertyList(withPhotos);
        } catch (e) {
            console.error('loadMyProperties error', e);
            listEl.innerHTML = '';
            errorEl?.classList.remove('d-none');
        }
}

    function renderPropertyList(properties) {
        if (!listEl) return;
        listEl.innerHTML = '';

        properties.forEach(p => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4 mb-3';

            const card = document.createElement('div');
            card.className = 'card h-100';

            const img = document.createElement('img');
            img.className = 'card-img-top';
            img.alt = 'Объект недвижимости';
            img.src =
                p.main_photo_url ||
                'https://via.placeholder.com/400x250?text=Property';
            card.appendChild(img);

            const body = document.createElement('div');
            body.className = 'card-body d-flex flex-column';

            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = p.title || 'Объект недвижимости';

            const typeP = document.createElement('p');
            typeP.className = 'card-text mb-1';
            typeP.textContent = `Тип: ${formatType(p.type)}`;

            const statusP = document.createElement('p');
            statusP.className = 'card-text mb-1';
            statusP.textContent = `Статус: ${formatStatus(p.status)}`;

            const locP = document.createElement('p');
            locP.className = 'card-text mb-1';
            locP.textContent = `Адрес: ${p.location || '—'}`;

            const priceP = document.createElement('p');
            priceP.className = 'card-text mb-3';
            const price = p.price_per_day != null ? Number(p.price_per_day) : null;
            priceP.textContent = `Цена: ${price || 0} ₽/сутки`;

            body.appendChild(title);
            body.appendChild(typeP);
            body.appendChild(statusP);
            body.appendChild(locP);
            body.appendChild(priceP);

            const btnGroup = document.createElement('div');
            btnGroup.className = 'mt-auto d-flex gap-2';

            const viewLink = document.createElement('a');
            viewLink.className = 'btn btn-sm btn-outline-secondary';
            viewLink.textContent = 'Открыть';
            viewLink.href = `property.html?id=${p.property_id}`;

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn btn-sm btn-outline-primary';
            editBtn.textContent = 'Редактировать';
            editBtn.addEventListener('click', () => openEditModal(p));

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.textContent = 'Удалить';
            deleteBtn.addEventListener('click', () => openDeleteModal(p));

            btnGroup.appendChild(viewLink);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            body.appendChild(btnGroup);
            card.appendChild(body);
            col.appendChild(card);
            listEl.appendChild(col);
        });
    }

    function resetPropertyForm() {
        if (!propertyIdInput) return;
        propertyIdInput.value = '';
        if (propertyTitleInput) propertyTitleInput.value = '';
        if (propertyTypeSelect) propertyTypeSelect.value = 'flat';
        if (propertyStatusSelect) propertyStatusSelect.value = 'available';
        if (propertyPriceInput) propertyPriceInput.value = '';
        if (propertyLocationInput) propertyLocationInput.value = '';
        if (propertyDescriptionInput) propertyDescriptionInput.value = '';
        if (propertyFeaturesInput) propertyFeaturesInput.value = '';
        if (propertyRentalTermsInput) propertyRentalTermsInput.value = '';
        if (photoUrlsInput) photoUrlsInput.value = '';
        if (propertyFormError) {
            propertyFormError.classList.add('d-none');
            propertyFormError.textContent = '';
        }
    }

    function openCreateModal() {
        resetPropertyForm();
        if (propertyModalLabel) {
            propertyModalLabel.textContent = 'Создать объявление';
        }
        if (propertyFormSubmitBtn) {
            propertyFormSubmitBtn.textContent = 'Создать';
        }
        propertyModal?.show();
    }

    function openEditModal(p) {
        resetPropertyForm();
        if (propertyIdInput) propertyIdInput.value = p.property_id;
        if (propertyTitleInput) propertyTitleInput.value = p.title || '';
        if (propertyTypeSelect) propertyTypeSelect.value = p.type || 'flat';
        if (propertyStatusSelect) propertyStatusSelect.value = p.status || 'available';
        if (propertyPriceInput) {
            propertyPriceInput.value =
                p.price_per_day != null ? String(Number(p.price_per_day)) : '';
        }
        if (propertyLocationInput) propertyLocationInput.value = p.location || '';
        if (propertyDescriptionInput) propertyDescriptionInput.value = p.description || '';
        if (propertyFeaturesInput) propertyFeaturesInput.value = p.features || '';
        if (propertyRentalTermsInput) {
            propertyRentalTermsInput.value = p.rental_terms || '';
        }

        if (propertyModalLabel) {
            propertyModalLabel.textContent = 'Редактировать объявление';
        }
        if (propertyFormSubmitBtn) {
            propertyFormSubmitBtn.textContent = 'Сохранить';
        }
        propertyModal?.show();
    }

    function openDeleteModal(p) {
        currentDeleteId = p.property_id;
        if (deletePropertyTitleEl) {
            deletePropertyTitleEl.textContent = `«${p.title || 'объявление'}»`;
        }
        deleteModal?.show();
    }

    async function uploadPhotosForProperty(propertyId) {
        if (!photoUrlsInput) return;
        const text = photoUrlsInput.value.trim();
        if (!text) return;

        const urls = text
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);

        if (!urls.length) return;

        const promises = urls.map(url =>
            apiPost(
                '/photos',
                { property_id: propertyId, photo_url: url },
                { auth: true }
            )
        );

        await Promise.all(promises);
    }

    if (openCreateBtn) {
        openCreateBtn.addEventListener('click', openCreateModal);
    }

    if (propertyForm) {
        propertyForm.addEventListener('submit', async e => {
            e.preventDefault();
            if (!ownerId) return;

            if (propertyFormError) {
                propertyFormError.classList.add('d-none');
                propertyFormError.textContent = '';
            }

            const idStr = propertyIdInput?.value || '';
            const isEdit = Boolean(idStr);
            const price = Number(propertyPriceInput?.value);

            if (!Number.isFinite(price) || price < 0) {
                if (propertyFormError) {
                    propertyFormError.textContent = 'Введите корректную цену.';
                    propertyFormError.classList.remove('d-none');
                }
                return;
            }

            const dto = {
                type: propertyTypeSelect?.value,
                title: propertyTitleInput?.value.trim(),
                description: propertyDescriptionInput?.value.trim(),
                location: propertyLocationInput?.value.trim(),
                price_per_day: price,
                status: propertyStatusSelect?.value,
                features: propertyFeaturesInput?.value.trim() || undefined,
                rental_terms: propertyRentalTermsInput?.value.trim() || undefined
            };

            if (!dto.title || !dto.description || !dto.location) {
                if (propertyFormError) {
                    propertyFormError.textContent = 'Заполните обязательные поля.';
                    propertyFormError.classList.remove('d-none');
                }
                return;
            }

            if (propertyFormSubmitBtn) {
                propertyFormSubmitBtn.disabled = true;
            }

            try {
                if (isEdit) {
                    const propertyId = Number(idStr);
                    await updateProperty(propertyId, dto);
                    await uploadPhotosForProperty(propertyId);
                } else {
                    const createDto = { ...dto, owner_id: ownerId };
                    const created = await createProperty(createDto);
                    const newId = created?.property_id;
                    if (newId) {
                        await uploadPhotosForProperty(newId);
                    }
                }

                propertyModal?.hide();
                await loadMyProperties();
            } catch (err) {
                console.error('property save error', err);
                if (propertyFormError) {
                    propertyFormError.textContent =
                        'Не удалось сохранить объявление. Попробуйте ещё раз.';
                    propertyFormError.classList.remove('d-none');
                }
            } finally {
                if (propertyFormSubmitBtn) {
                    propertyFormSubmitBtn.disabled = false;
                }
            }
        });
    }

    if (confirmDeletePropertyBtn) {
        confirmDeletePropertyBtn.addEventListener('click', async () => {
            if (!currentDeleteId) return;
            confirmDeletePropertyBtn.disabled = true;

            try {
                await deleteProperty(currentDeleteId);
                deleteModal?.hide();
                currentDeleteId = null;
                await loadMyProperties();
            } catch (err) {
                console.error('delete property error', err);
                alert('Не удалось удалить объявление. Попробуйте ещё раз.');
            } finally {
                confirmDeletePropertyBtn.disabled = false;
            }
        });
    }

    loadMyProperties();
});