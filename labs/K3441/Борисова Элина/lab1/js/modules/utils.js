function getUserById(userId) {
    return window.MOCK_USERS.find(user => user.id === userId);
}

function getDayText(days) {
    if (days == 1) return 'день';
    if (days > 1 && days < 5) return 'дня';
    return 'дней';
}

function getMonthText(months) {
    if (months == 1) return 'месяц';
    if (months > 1 && months < 5) return 'месяца';
    return 'месяцев';
}

function handleImageError(imgElement, propertyType) {
    imgElement.src = getPlaceholderImage(propertyType);
}

function checkFunctionAvailability(functionName) {
    if (typeof window[functionName] !== 'function') {
        console.error(`Функция ${functionName} не доступна`);
        return false;
    }
    return true;
}

window.getUserById = getUserById;
window.getDayText = getDayText;
window.getMonthText = getMonthText;
window.handleImageError = handleImageError;
window.checkFunctionAvailability = checkFunctionAvailability;