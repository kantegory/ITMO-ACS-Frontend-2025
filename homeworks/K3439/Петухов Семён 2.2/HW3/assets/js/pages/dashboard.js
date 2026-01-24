(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const pages = FastRent.pages = FastRent.pages || {};

  async function initDashboard() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    const notifier = FastRent.notifications;
    if (!services || !auth) return;
    const { deleteAdvertisement, fetchAdvertisement, normalizeId, statusText } = services;
    const { getCurrentUser, logout } = auth;
    const user = getCurrentUser();
    if (!user) {
      window.location = 'login.html';
      return;
    }
    const userId = normalizeId(user.id);
    if (!userId) {
      logout();
      return;
    }
    const welcomeEl = document.getElementById('dashWelcome');
    if (welcomeEl) welcomeEl.textContent = `Добро пожаловать, ${user.name}`;
    const ownedCt = document.getElementById('ownedList');
    const rentedCt = document.getElementById('rentedList');
    let props = await fetchAdvertisement();

    const renderLists = () => {
      if (ownedCt) {
        ownedCt.innerHTML = '';
        props
          .filter((p) => normalizeId(p.ownerId) === userId)
          .forEach((p) => ownedCt.appendChild(makeItem(p, true)));
      }
      if (rentedCt) {
        rentedCt.innerHTML = '';
        props
          .filter((p) => normalizeId(p.tenantId) === userId)
          .forEach((p) => rentedCt.appendChild(makeItem(p, false)));
      }
    };

    async function handleDelete(advId) {
      let confirmed = true;
      if (notifier && notifier.confirm) {
        confirmed = await notifier.confirm({
          title: 'Удалить объявление?',
          message: 'Действие нельзя отменить.',
          confirmText: 'Удалить',
          type: 'danger'
        });
      }
      if (!confirmed) return;
      const ok = await deleteAdvertisement(advId);
      if (ok) {
        props = props.filter((p) => p.id !== advId);
        renderLists();
        if (notifier && notifier.showSuccess) {
          notifier.showSuccess('Объявление удалено.');
        }
      }
    }

    function makeItem(p, isOwner) {
      const propId = normalizeId(p.id) || p.id;
      const cover = Array.isArray(p.images) && p.images.length ? p.images[0] : 'https://via.placeholder.com/100x70?text=No+image';
      const div = document.createElement('div');
      div.className = 'list-item';
      div.setAttribute('role', 'listitem');
      div.setAttribute('aria-label', `${p.title}, ${p.location}`);
      div.innerHTML = `
        <img src="${cover}" class="list-thumb" alt="${p.title}">
        <div class="flex-fill">
            <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>${p.title}</strong>
              <div class="text-muted small">${p.location} • ${p.type}</div>
            </div>
            <div class="text-end">
              <div class="fw-semibold">₽${p.price}/мес</div>
              <small class="text-muted">${statusText(p.status)}</small>
            </div>
          </div>
          <div class="mt-2">
            <a href="property.html?id=${propId}" class="btn btn-sm btn-outline-primary me-2">Просмотр</a>
            ${isOwner ? `<button class="btn btn-sm btn-danger remove-btn" data-id="${propId}">Удалить</button>` : ''}
          </div>
        </div>
      `;
      if (isOwner) {
        const btn = div.querySelector('.remove-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            handleDelete(propId);
          });
        }
      }
      return div;
    }

    renderLists();
  }

  pages.dashboard = initDashboard;
})(window);
