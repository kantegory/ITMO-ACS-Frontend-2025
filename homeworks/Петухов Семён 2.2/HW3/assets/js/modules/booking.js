(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const notifier = FastRent.notifications;

  function initBooking() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    if (!services || !auth) return;
    const { getPropertyById, normalizeId } = services;
    const { getCurrentUser } = auth;
    const form = document.getElementById('bookForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentUser = getCurrentUser();
      if (!currentUser) {
        if (notifier && notifier.showModal) {
          await notifier.showModal({
            title: 'Требуется вход',
            message: 'Пожалуйста, войдите, чтобы забронировать.',
            type: 'warning'
          });
        }
        window.location = 'login.html';
        return;
      }
      const id = normalizeId(form.propertyId?.value);
      if (!id) {
        if (notifier && notifier.showModal) {
          notifier.showModal({
            title: 'Ошибка',
            message: 'Некорректное объявление для бронирования.',
            type: 'danger'
          });
        }
        return;
      }
      const prop = await getPropertyById(id);
      if (!prop) {
        if (notifier && notifier.showModal) {
          notifier.showModal({
            title: 'Ошибка',
            message: 'Объявление не найдено',
            type: 'danger'
          });
        }
        return;
      }
      if (notifier && notifier.showSuccess) {
        notifier.showSuccess(`Запрос на бронирование "${prop.title}" отправлен. Владелец свяжется с вами.`);
      }
      const bmodal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
      if (bmodal) bmodal.hide();
    });
  }

  FastRent.initBooking = initBooking;
})(window);
