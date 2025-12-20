(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const pages = FastRent.pages = FastRent.pages || {};

  async function initPropertyPage() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    const notifier = FastRent.notifications;
    if (!services || !auth) return;
    const { getPropertyById, normalizeId } = services;
    const { getCurrentUser } = auth;
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    const propId = normalizeId(idParam);
    if (!propId) {
      document.body.innerHTML = '<div class="container py-5"><h3>Объявление не найдено.</h3></div>';
      return;
    }
    const prop = await getPropertyById(propId);
    if (!prop) {
      document.body.innerHTML = '<div class="container py-5"><h3>Объявление не найдено.</h3></div>';
      return;
    }
    document.getElementById('propTitle').textContent = prop.title;
    document.getElementById('propLocation').textContent = `${prop.location} • ${prop.type}`;
    document.getElementById('propPrice').textContent = `₽${prop.price}/мес`;
    document.getElementById('propDesc').textContent = prop.description;
    document.getElementById('propTerms').textContent = prop.rentTerms;
    document.getElementById('propMeta').textContent = `${prop.beds} спал. • ${prop.baths} ван.`;

    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = '';
    const gallery = Array.isArray(prop.images) && prop.images.length ? prop.images : ['https://via.placeholder.com/800x420?text=No+image'];
    gallery.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = 'carousel-item' + (idx === 0 ? ' active' : '');
      const altText = `${prop.title || 'Объявление'} — фото ${idx + 1}`;
      item.innerHTML = `<img src="${img}" class="d-block w-100 property-carousel-img" alt="${altText}">`;
      carouselInner.appendChild(item);
    });

    document.getElementById('bookPropBtn').addEventListener('click', () => {
      const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
      document.getElementById('bookModalLabel').textContent = `Бронирование: ${prop.title}`;
      document.getElementById('bookPropertyId').value = prop.id;
      bookModal.show();
    });

    document.getElementById('contactBtn').addEventListener('click', async () => {
      const user = getCurrentUser();
      if (!user) {
        if (notifier && notifier.showModal) {
          await notifier.showModal({
            title: 'Требуется вход',
            message: 'Пожалуйста, войдите, чтобы связаться с владельцем.',
            type: 'warning'
          });
        }
        window.location = 'login.html';
        return;
      }
      let msg = '';
      if (notifier && notifier.prompt) {
        msg = await notifier.prompt({
          title: 'Сообщение владельцу',
          message: `Напишите сообщение владельцу объекта "${prop.title}"`,
          placeholder: 'Ваше сообщение',
          type: 'info'
        }) || '';
      }
      if (msg && notifier && notifier.showSuccess) {
        notifier.showSuccess('Сообщение отправлено (демо).');
      }
    });
  }

  pages.property = initPropertyPage;
})(window);
