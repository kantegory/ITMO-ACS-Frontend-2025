// логика профиля

// инициализация

/**
 * Инициализировать страницу профиля
 */
function initProfilePage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    displayUserInfo(currentUser);
    loadUserReviews(currentUser);
    loadUserFavorites(currentUser);
}

// отображение информации пользователя

/**
 * Отобразить информацию пользователя
 * @param {Object} user
 */
function displayUserInfo(user) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');

    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;
    if (editName) editName.value = user.name;
    if (editEmail) editEmail.value = user.email;
}

// отзывы пользователя

/**
 * Загрузить отзывы пользователя
 * @param {Object} user
 */
function loadUserReviews(user) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsList) return;

    // получить все альбомы с отзывами
    const albums = JSON.parse(localStorage.getItem('albums') || '[]');

    // найти отзывы текущего пользователя
    const userReviews = [];
    albums.forEach(album => {
        if (album.reviews) {
            album.reviews.forEach(review => {
                if (review.author === user.name) {
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

    // если нет отзывов
    if (userReviews.length === 0) {
        reviewsList.innerHTML = '<p class="text-muted">Вы пока не оставили ни одного отзыва</p>';
        return;
    }

    // отрендерить отзывы
    reviewsList.innerHTML = userReviews.map(review => `
        <div class="card mb-3" style="cursor: pointer;" onclick="openAlbum(${review.albumId})">
            <div class="card-body">
                <h5 class="card-title">${review.albumTitle}</h5>
                <p class="text-muted">${review.artist}</p>
                <div class="mb-2">
                    <span class="badge bg-warning text-dark">⭐ ${review.rating}/10</span>
                    <small class="text-muted ms-2">${review.date}</small>
                </div>
                ${review.text ? `<p class="card-text">${review.text}</p>` : '<p class="text-muted"><em>(только оценка)</em></p>'}
            </div>
        </div>
    `).join('');
}

// избранные альбомы

/**
 * Загрузить избранные альбомы пользователя
 * @param {Object} user
 */
function loadUserFavorites(user) {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    // Получаем ids избранных альбомов
    const favoritesIds = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    console.log('favorite IDs:', favoritesIds);
    console.log('MOCK_ALBUMS:', MOCK_ALBUMS);

    // Находим объекты альбомов по id
    const favoriteAlbums = MOCK_ALBUMS.filter(album => favoritesIds.includes(album.id));
    console.log('favoriteAlbums:', favoriteAlbums);

    // Отрисовка
    if (favoriteAlbums.length === 0) {
        favoritesList.innerHTML = 'Нет избранных альбомов';
        return;
    }
    favoritesList.innerHTML = favoriteAlbums.map(album => `
        <div class="album-card">
            <h5>${album.albumTitle}</h5>
            <p>${album.artist}</p>
            <a href="album-detail.html?id=${album.id}" class="btn btn-primary btn-sm">Открыть альбом</a>
        </div>
    `).join('');
}


// редактирование профиля

/**
 * Обработка формы редактирования профиля
 */
function attachEditProfileHandler() {
    const editProfileForm = document.getElementById('editProfileForm');
    
    if (!editProfileForm) return;

    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const currentUser = getCurrentUser();
        const newName = document.getElementById('editName').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();

        // валидация
        if (!newName || newName.length < 2) {
            alert('Имя должно содержать минимум 2 символа');
            return;
        }

        if (!validateEmail(newEmail)) {
            alert('Некорректный формат email');
            return;
        }

        // проверить, не занят ли email другим пользователем
        const allUsers = getAllUsers();
        const emailExists = allUsers.some(user => 
            user.email === newEmail && user.id !== currentUser.id
        );

        if (emailExists) {
            alert('Этот email уже используется другим пользователем');
            return;
        }

        // обновить текущего пользователя
        currentUser.name = newName;
        currentUser.email = newEmail;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // обновить данные в списке всех пользователей
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            users[userIndex].email = newEmail;
            saveUsers(users);
        }

        console.log('Профиль обновлен');
        alert('Профиль успешно обновлен!');

        // закрыть модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();

        // обновить отображение
        displayUserInfo(currentUser);
    });
}
