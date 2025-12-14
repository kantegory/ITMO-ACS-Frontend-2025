// albumrate - утилиты для работы с хранилищем

// работа с пользователями

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email) || null;
}

function findUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id) || null;
}

// работа с альбомами

function getAlbumFromStorage(id) {
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');
    return albums.find(album => album.id === id) || null;
}

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

function getAllAlbumsFromStorage() {
    return JSON.parse(localStorage.getItem('albums') || '[]');
}

// работа с избранными

function getUserFavorites(userId) {
    return JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
}

function addToFavorites(userId, albumId) {
    let favorites = getUserFavorites(userId);
    
    if (!favorites.includes(albumId)) {
        favorites.push(albumId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return true;
    }
    
    return false;
}

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

function isFavorite(userId, albumId) {
    const favorites = getUserFavorites(userId);
    return favorites.includes(albumId);
}

// работа с отзывами

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

function getAlbumReviews(albumId) {
    const album = getAlbumFromStorage(albumId);
    return album ? album.reviews : [];
}

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

function getAverageRating(albumId) {
    const reviews = getAlbumReviews(albumId);
    
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

// валидация

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    return { valid: true, message: '' };
}

function validateName(name) {
    return name.trim().length >= 2;
}

// очистка данных

function clearAllStorage() {
    if (confirm('Вы уверены? Все данные будут удалены!')) {
        localStorage.clear();
        console.log('Все данные очищены');
        window.location.href = 'login.html';
    }
}

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
