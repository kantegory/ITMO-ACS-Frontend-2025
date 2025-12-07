(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const dataService = FastRent.dataService;
  if (!dataService) {
    console.error('FastRent dataService не инициализирован');
    return;
  }
  const { withStringId } = dataService;

  function getCurrentUser() {
    const raw = localStorage.getItem('rental_currentUser');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const normalized = withStringId(parsed);
      if (normalized) return normalized;
    } catch (err) {
      console.warn('Не удалось распарсить сохранённого пользователя', err);
    }
    localStorage.removeItem('rental_currentUser');
    return null;
  }

  function setCurrentUser(user) {
    const normalized = withStringId(user);
    if (!normalized) return;
    localStorage.setItem('rental_currentUser', JSON.stringify(normalized));
  }

  function logout() {
    localStorage.removeItem('rental_currentUser');
    window.location = 'index.html';
  }

  FastRent.auth = {
    getCurrentUser,
    setCurrentUser,
    logout
  };
})(window);
