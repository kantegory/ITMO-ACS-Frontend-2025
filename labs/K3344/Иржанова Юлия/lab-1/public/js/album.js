// логика страницы альбома

// инициализация

/**
 * Инициализировать страницу альбома
 */
function initAlbumPage() {
    const albumId = getAlbumIdFromURL();
    
    if (!albumId) {
        console.error('ID альбома не найден в URL');
        window.location.href = 'catalog.html';
        return;
    }

    const album = findAlbumById(albumId);
    
    if (!album) {
        console.error('Альбом не найден');
        window.location.href = 'catalog.html';
        return;
    }

    displayAlbumInfo(album);
    displayTracks(album);
    displayReviews(album);
    attachReviewFormHandler(album);
    attachFavoriteButton(album);
}

// получение данных

/**
 * Получить ID альбома из URL параметров
 * @returns {number|null}
 */
function getAlbumIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') ? parseInt(params.get('id')) : null;
}

/**
 * Найти альбом по ID
 * @param {number} id
 * @returns {Object|null}
 */
function findAlbumById(id) {
    return MOCK_ALBUMS.find(album => album.id === id) || null;
}

/**
 * Получить альбом из localStorage (с отзывами пользователя)
 * @param {number} id
 * @returns {Object|null}
 */
function getAlbumFromStorage(id) {
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    return albums.find(album => album.id === id);
}

/**
 * Сохранить альбом в localStorage
 * @param {Object} album
 */
function saveAlbumToStorage(album) {
    let albums = JSON.parse(localStorage.getItem('albums') || '[]');
    const index = albums.findIndex(a => a.id === album.id);
    
    if (index !== -1) {
        albums[index] = album;
    } else {
        albums.push(album);
    }
    
    localStorage.setItem('albums', JSON.stringify(albums));
}

// отображение информации об альбоме

/**
 * Отобразить информацию об альбоме
 * @param {Object} album
 */
function displayAlbumInfo(album) {
    // заголовок
    document.getElementById('albumTitle').textContent = album.albumTitle;
    
    // обложка
    const albumCover = document.getElementById('albumCover');
    if (albumCover) {
            albumCover.innerHTML = album.coverUrl
                ? `<img src="${album.coverUrl}" alt="" class="album-image">`
                : `<div class="no-cover">Нет обложки</div>`;

    }
    
    // мета-информация (артист, год, жанр)
    const metaInfo = `${album.artist} • ${album.year} • ${album.genre}`;
    document.getElementById('albumMetaInfo').textContent = metaInfo;

    // описание
    document.getElementById('albumDescription').textContent = album.description;

    // средняя оценка
    const albumRating = document.getElementById('albumRating');
    if (albumRating) {
        const rating = calculateAverageRating(album);
        albumRating.textContent = rating.toFixed(1);
    }
}

/**
 * Отобразить список треков
 * @param {Object} album
 */
function displayTracks(album) {
    console.log(album.tracks);
    console.log('Треки для рендера:', album.tracks);
    const tracksList = document.getElementById('tracksList');
    
    if (!tracksList || !album.tracks || album.tracks.length === 0) {
        return;
    }

    tracksList.innerHTML = album.tracks.map((track, index) => `
        <li class="list-group-item">
            ${index + 1}. ${track}
        </li>
    `).join('');
}

// отзывы

/**
 * Отобразить отзывы альбома
 * @param {Object} album
 */
function displayReviews(album) {
    const reviewsList = document.getElementById('reviewsList');
    const reviewsCount = document.getElementById('reviewsCount');
    
    if (!reviewsList) return;

    const reviews = album.reviews || [];

    // обновить количество отзывов
    if (reviewsCount) {
        reviewsCount.textContent = reviews.length;
    }

    // если нет отзывов
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="alert alert-info" role="alert">
                Пока нет отзывов. Будьте первым!
            </div>
        `;
        return;
    }

    // отрендерить отзывы
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-author-block">
                    <div class="review-avatar">👤</div>
                    <div>
                        <div class="review-author">${review.author}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <span class="review-rating">${review.rating}/10</span>
            </div>
            ${review.text ? `<div class="review-text">${review.text}</div>` : '<div class="review-text empty">(только оценка)</div>'}
        </div>
    `).join('');
}

/**
 * Рассчитать среднюю оценку альбома
 * @param {Object} album
 * @returns {number}
 */
function calculateAverageRating(album) {
    const reviews = album.reviews || [];
    
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

// обработка формы отзыва

/**
 * Присоединить обработчик к форме отзыва
 * @param {Object} album
 */
function attachReviewFormHandler(album) {
    const reviewForm = document.getElementById('reviewForm');
    
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            alert('Пожалуйста, авторизуйтесь');
            return;
        }

        const rating = parseInt(document.getElementById('reviewRating').value);
        const text = document.getElementById('reviewText').value.trim();

        // валидация
        if (!rating || rating < 1 || rating > 10) {
            alert('Пожалуйста, поставьте оценку от 1 до 10');
            return;
        }

        // создание отзыва
        const review = {
            id: Date.now(),
            author: currentUser.name,
            rating: rating,
            text: text || null,
            date: new Date().toLocaleDateString('ru-RU')
        };

        // добавить отзыв к альбому
        album.reviews.push(review);

        // сохранить в localStorage
        saveAlbumToStorage(album);

        console.log('Отзыв опубликован');
        alert('Спасибо за ваш отзыв!');

        // обновить отображение
        displayReviews(album);
        displayAlbumInfo(album);

        // закрыть модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('addReviewModal'));
        if (modal) modal.hide();

        // очистить форму
        reviewForm.reset();
    });
}

// кнопка избранное

/**
 * Присоединить обработчик к кнопке избранного
 * @param {Object} album
 */
function attachFavoriteButton(album) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    if (!favoriteBtn) return;

    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    // проверить, в избранном ли альбом
    const userFavorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`) || '[]');
    const isFavorite = userFavorites.includes(album.id);

    // обновить вид кнопки
    updateFavoriteButtonState(favoriteBtn, isFavorite);

    // присоединить обработчик
    favoriteBtn.addEventListener('click', function() {
        let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`) || '[]');
        const index = favorites.indexOf(album.id);

        if (index !== -1) {
            // удалить из избранного
            favorites.splice(index, 1);
            updateFavoriteButtonState(favoriteBtn, false);
            console.log('Удалено из избранного');
        } else {
            // добавить в избранное
            favorites.push(album.id);
            updateFavoriteButtonState(favoriteBtn, true);
            console.log('Добавлено в избранное');
        }

        localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    });
}

/**
 * Обновить вид кнопки избранного
 * @param {HTMLElement} button
 * @param {boolean} isFavorite
 */
function updateFavoriteButtonState(button, isFavorite) {
    if (isFavorite) {
        button.classList.remove('btn-outline-danger');
        button.classList.add('btn-danger');
        button.innerHTML = 'В избранном';
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline-danger');
        button.innerHTML = 'Добавить в избранное';
    }
}

