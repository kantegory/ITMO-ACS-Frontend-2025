(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const pages = FastRent.pages = FastRent.pages || {};

  async function initMessages() {
    const services = FastRent.dataService;
    const auth = FastRent.auth;
    if (!services || !auth) return;
    const { fetchAdvertisement, fetchConversations, fetchTransactions, normalizeId } = services;
    const { getCurrentUser } = auth;
    const user = getCurrentUser();
    if (!user) {
      window.location = 'login.html';
      return;
    }
    const convCt = document.getElementById('conversations');
    const txCt = document.getElementById('transactions');
    if (convCt) convCt.innerHTML = '';
    if (txCt) txCt.innerHTML = '';

    const [convs, txs, props] = await Promise.all([
      fetchConversations(user.id),
      fetchTransactions(user.id),
      fetchAdvertisement()
    ]);
    const propById = new Map(props.map((p) => [normalizeId(p.id) || String(p.id), p]));
    const resolveProp = (id) => propById.get(normalizeId(id) || id);

    if (convCt) {
      if (convs.length === 0) {
        convCt.innerHTML = '<div class="text-muted" role="status">Нет сообщений.</div>';
      } else {
        convs.forEach((c) => {
          const prop = resolveProp(c.propertyId);
          const div = document.createElement('div');
          div.className = 'list-item';
          div.setAttribute('role', 'listitem');
          div.innerHTML = `
            <div class="flex-fill">
              <div class="d-flex justify-content-between">
                <div>
                  <strong>${c.with}</strong>
                  <div class="text-muted small">${prop ? prop.title : 'Объявление удалено'}</div>
                </div>
                <div class="text-muted small">${c.date}</div>
              </div>
              <div class="mt-2 text-muted small">${c.lastMessage || ''}</div>
            </div>
          `;
          convCt.appendChild(div);
        });
      }
    }

    if (txCt) {
      if (txs.length === 0) {
        txCt.innerHTML = '<div class="text-muted" role="status">Транзакции отсутствуют.</div>';
      } else {
        txs.forEach((t) => {
          const prop = resolveProp(t.propertyId);
          const d = document.createElement('div');
          d.className = 'list-item';
          d.setAttribute('role', 'listitem');
          d.innerHTML = `
            <div class="flex-fill d-flex justify-content-between">
              <div>
                <strong>${prop ? prop.title : 'Объявление удалено'}</strong>
                <div class="text-muted small">${t.date}</div>
              </div>
              <div class="text-end">
                <div class="fw-semibold">₽${t.amount}</div>
                <small class="text-muted">${t.status || ''}</small>
              </div>
            </div>
          `;
          txCt.appendChild(d);
        });
      }
    }
  }

  pages.messages = initMessages;
})(window);
