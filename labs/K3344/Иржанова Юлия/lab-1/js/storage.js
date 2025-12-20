// albumrate - утилиты для работы с хранилищем

// работа с пользователями

/**
 * Получить текущего авторизованного пользователя
 * @returns {Object|null}
 */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Получить всех зарегистрированных пользователей
 * @returns {Array}
 */
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

/**
 * Сохранить пользователей в localStorage
 * @param {Array} users
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Найти пользователя по email
 * @param {string} email
 * @returns {Object|null}
 */
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email) || null;
}

/**
 * Найти пользователя по ID
 * @param {number} id
 * @returns {Object|null}
 */
function findUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id) || null;
}

// работа с альбомами

/**
 * Получить альбом из localStorage по ID
 * @param {number} id
 * @returns {Object|null}
 */
function getAlbumFromStorage(id) {
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    return albums.find(album => album.id === id) || null;
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

/**
 * Получить все альбомы с отзывами из localStorage
 * @returns {Array}
 */
function getAllAlbumsFromStorage() {
    return JSON.parse(localStorage.getItem('albums') || '[]');
}

// работа с избранными

/**
 * Получить избранные альбомы пользователя
 * @param {number} userId
 * @returns {Array} массив ID альбомов
 */
function getUserFavorites(userId) {
    return JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
}

/**
 * Добавить альбом в избранное
 * @param {number} userId
 * @param {number} albumId
 */
function addToFavorites(userId, albumId) {
    let favorites = getUserFavorites(userId);
    
    if (!favorites.includes(albumId)) {
        favorites.push(albumId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return true;
    }
    
    return false;
}

/**
 * Удалить альбом из избранного
 * @param {number} userId
 * @param {number} albumId
 */
function removeFromFavorites(userId, albumId) {
    let favorites = getUserFavorites(userId);
    const index = favorites.indexOf(albumId);
    
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return true;
    }
    
    return false;
}

/**
 * Проверить, в избранном ли альбом
 * @param {number} userId
 * @param {number} albumId
 * @returns {boolean}
 */
function isFavorite(userId, albumId) {
    const favorites = getUserFavorites(userId);
    return favorites.includes(albumId);
}

// работа с отзывами

/**
 * Добавить отзыв к альбому
 * @param {number} albumId
 * @param {Object} review
 * @returns {boolean}
 */
function addReviewToAlbum(albumId, review) {
    let album = getAlbumFromStorage(albumId);
    
    if (!album) {
        // если альбома нет в localStorage, создаём его
        const mockAlbum = MOCK_ALBUMS.find(a => a.id === albumId);
        if (!mockAlbum) return false;
        
        album = { ...mockAlbum, reviews: [] };
    }
    
    album.reviews.push(review);
    saveAlbumToStorage(album);
    return true;
}

/**
 * Получить все отзывы альбома
 * @param {number} albumId
 * @returns {Array}
 */
function getAlbumReviews(albumId) {
    const album = getAlbumFromStorage(albumId);
    return album ? album.reviews : [];
}

/**
 * Получить отзывы пользователя
 * @param {string} userName
 * @returns {Array}
 */
function getUserReviews(userName) {
    const albums = getAllAlbumsFromStorage();
    const userReviews = [];
    
    albums.forEach(album => {
        if (album.reviews) {
            album.reviews.forEach(review => {
                if (review.author === userName) {
                    userReviews.push({
                        ...review,
                        albumId: album.id,
                        albumTitle: album.albumTitle,
                        artist: album.artist
                    });
                }
            });
        }
    });
    
    return userReviews;
}

/**
 * Рассчитать среднюю оценку альбома
 * @param {number} albumId
 * @returns {number}
 */
function getAverageRating(albumId) {
    const reviews = getAlbumReviews(albumId);
    
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

// валидация

/**
 * Валидировать email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Валидировать пароль
 * @param {string} password
 * @returns {Object} { valid: boolean, message: string }
 */
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    return { valid: true, message: '' };
}

/**
 * Валидировать имя
 * @param {string} name
 * @returns {boolean}
 */
function validateName(name) {
    return name.trim().length >= 2;
}

// очистка данных

/**
 * Очистить все данные localStorage (для тестирования)
 */
function clearAllStorage() {
    if (confirm('Вы уверены? Все данные будут удалены!')) {
        localStorage.clear();
        console.log('Все данные очищены');
        window.location.href = 'login.html';
    }
}

/**
 * Экспортировать данные пользователя (для отладки)
 * @returns {Object}
 */
function exportUserData() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        console.log('Пользователь не авторизован');
        return null;
    }
    
    return {
        user: currentUser,
        favorites: getUserFavorites(currentUser.id),
        reviews: getUserReviews(currentUser.name),
        allUsers: getAllUsers(),
        allAlbums: getAllAlbumsFromStorage()
    };
}

/**
 * Логировать состояние localStorage (для отладки)
 */
function logStorageState() {
    console.log('=== STORAGE STATE ===');
    console.log('Current User:', getCurrentUser());
    console.log('All Users:', getAllUsers());
    console.log('All Albums:', getAllAlbumsFromStorage());
    console.log('=====================');
}
