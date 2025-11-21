// логика каталога и фильтрации

// инициализация

/**
 * Инициализировать каталог
 */
function initCatalog() {
    renderAlbums(MOCK_ALBUMS);
    initFilters();
}

// отображение альбомов

/**
 * Отрендерить список альбомов
 * @param {Array} albums - массив альбомов для отображения
 */
function renderAlbums(albums) {
    const albumsList = document.getElementById('albumsList');
    if (!albumsList) return;

    if (albums.length === 0) {
        albumsList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    Альбомы не найдены по выбранным фильтрам
                </div>
            </div>
        `;
        return;
    }

    albumsList.innerHTML = albums.map(album => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card album-card" onclick="openAlbum(${album.id})">
                <div class="album-cover">
                    ${
                        album.coverUrl
                        ? `<img src="${album.coverUrl}" alt="${album.albumTitle}" class="img-fluid rounded mb-1">`
                        : `<span style="font-size:50px;">${album.cover}</span>`
                    }
                    <div class="album-rating">${album.rating.toFixed(1)}</div>
                </div>
                <div class="album-info">
                    <div class="album-title">${album.albumTitle}</div>
                    <div class="album-artist">${album.artist}</div>
                    <div class="album-year">${album.year} • ${album.genre}</div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Открыть страницу альбома
 * @param {number} albumId - ID альбома
 */
function openAlbum(albumId) {
    window.location.href = `album-detail.html?id=${albumId}`;
}

// фильтры

/**
 * Инициализировать фильтры
 */
function initFilters() {
    renderGenreFilters();
    attachFilterEvents();
}

/**
 * Отрендерить чекбоксы жанров
 */
function renderGenreFilters() {
    const genreFilters = document.getElementById('genreFilters');
    
    if (!genreFilters) return;

    // получить уникальные жанры
    const genres = [...new Set(MOCK_ALBUMS.map(album => album.genre))];

    genreFilters.innerHTML = genres.map(genre => `
        <div class="form-check">
            <input class="form-check-input genre-checkbox" type="checkbox" id="genre-${genre}" value="${genre}">
            <label class="form-check-label" for="genre-${genre}">
                ${genre}
            </label>
        </div>
    `).join('');
}

/**
 * Присоединить события к элементам фильтров
 */
function attachFilterEvents() {
    // обработка фильтра по жанру
    document.querySelectorAll('.genre-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // обработка слайдера года
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.addEventListener('input', function() {
            document.getElementById('yearValue').textContent = this.value;
            applyFilters();
        });
    }

    // обработка слайдера рейтинга
    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter) {
        ratingFilter.addEventListener('input', function() {
            document.getElementById('ratingValue').textContent = this.value;
            applyFilters();
        });
    }

    // кнопка сброса фильтров
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Получить выбранные жанры
 * @returns {Array} массив выбранных жанров
 */
function getSelectedGenres() {
    const checkboxes = document.querySelectorAll('.genre-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Получить минимальный год
 * @returns {number}
 */
function getMinYear() {
    const yearFilter = document.getElementById('yearFilter');
    return yearFilter ? parseInt(yearFilter.value) : 1960;
}

/**
 * Получить минимальный рейтинг
 * @returns {number}
 */
function getMinRating() {
    const ratingFilter = document.getElementById('ratingFilter');
    return ratingFilter ? parseFloat(ratingFilter.value) : 0;
}

/**
 * Применить все фильтры к альбомам
 */
function applyFilters() {
    const selectedGenres = getSelectedGenres();
    const minYear = getMinYear();
    const minRating = getMinRating();

    // фильтрировать альбомы
    let filtered = MOCK_ALBUMS.filter(album => {
        // если жанры выбраны - фильтровать по ним
        if (selectedGenres.length > 0 && !selectedGenres.includes(album.genre)) {
            return false;
        }

        // фильтровать по году
        if (album.year < minYear) {
            return false;
        }

        // фильтровать по рейтингу
        if (album.rating < minRating) {
            return false;
        }

        return true;
    });
    
    // отрендерить отфильтрованные альбомы
    renderAlbums(filtered);
}

/**
 * Сбросить все фильтры
 */
function resetFilters() {
    // очистить все чекбоксы
    document.querySelectorAll('.genre-checkbox').forEach(cb => {
        cb.checked = false;
    });

    // вернуть слайдеры на начальные значения
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.value = 1960;
        document.getElementById('yearValue').textContent = '1960';
    }

    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter) {
        ratingFilter.value = 0;
        document.getElementById('ratingValue').textContent = '0';
    }

    // показать все альбомы
    renderAlbums(MOCK_ALBUMS);
}

