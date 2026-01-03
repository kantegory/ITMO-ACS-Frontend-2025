(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const pages = FastRent.pages = FastRent.pages || {};

  async function initProfile() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    const notifier = FastRent.notifications;
    if (!services || !auth) return;
    const { getUserById, normalizeId, updateUser } = services;
    const { getCurrentUser, setCurrentUser, logout } = auth;
    let user = getCurrentUser();
    if (!user) {
      window.location = 'login.html';
      return;
    }
    const fresh = await getUserById(user.id);
    if (!fresh) {
      localStorage.removeItem('rental_currentUser');
      window.location = 'login.html';
      return;
    }
    setCurrentUser(fresh);
    user = fresh;

    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    const usernameEl = document.getElementById('profileUsername');
    const locationEl = document.getElementById('profileLocation');
    const aboutEl = document.getElementById('profileAbout');
    const avatarEl = document.getElementById('profileAvatar');
    if (nameEl) nameEl.textContent = user.name || '';
    if (emailEl) emailEl.textContent = user.email || '';
    if (usernameEl) usernameEl.textContent = user.username || (user.email ? user.email.split('@')[0] : '');
    if (locationEl) locationEl.textContent = user.location || '—';
    if (aboutEl) aboutEl.textContent = user.about || '';
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;

    const editBtn = document.getElementById('editProfileBtn');
    const modalEl = document.getElementById('profileModal');
    if (editBtn && modalEl) {
      const profileModal = new bootstrap.Modal(modalEl);
      editBtn.addEventListener('click', () => {
        const form = document.getElementById('profileForm');
        if (!form) return;
        form.name.value = user.name || '';
        form.email.value = user.email || '';
        form.username.value = user.username || '';
        form.location.value = user.location || '';
        form.avatar.value = user.avatar || '';
        form.about.value = user.about || '';
        profileModal.show();
      });

      const form = document.getElementById('profileForm');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const username = form.username.value.trim();
        const location = form.location.value.trim();
        const avatar = form.avatar.value.trim();
        const about = form.about.value.trim();
        if (!name || !email) {
          if (notifier && notifier.showModal) {
            notifier.showModal({
              title: 'Проверьте данные',
              message: 'Имя и эл. почта обязательны.',
              type: 'danger'
            });
          }
          return;
        }
        const cur = getCurrentUser();
        const curId = normalizeId(cur?.id);
        if (!curId) {
          logout();
          return;
        }
        const updated = await updateUser(curId, { name, email, username, location, avatar, about });
        if (!updated) return;
        setCurrentUser(updated);
        if (nameEl) nameEl.textContent = updated.name;
        if (emailEl) emailEl.textContent = updated.email;
        if (usernameEl) usernameEl.textContent = updated.username || updated.email.split('@')[0];
        if (locationEl) locationEl.textContent = updated.location || '—';
        if (aboutEl) aboutEl.textContent = updated.about || '';
        if (avatarEl && updated.avatar) avatarEl.src = updated.avatar;
        profileModal.hide();
      });
    }
  }

  pages.profile = initProfile;
})(window);
