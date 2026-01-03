(function(global){
  const FastRent = global.FastRent = global.FastRent || {};
  const API_BASE_URL = 'http://localhost:3001';
  const api = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });
  let conversationsCache = new Map();
  let transactionsCache = new Map();
  const notifier = FastRent.notifications;

  function notifyError(message) {
    if (notifier && typeof notifier.showError === 'function') {
      notifier.showError(message);
    } else {
      console.error(message);
    }
  }

  function handleApiError(message, error) {
    console.error(message, error);
    notifyError(message);
  }

  function normalizeId(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    }
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return String(value);
    }
    return null;
  }

  function withStringId(entity) {
    if (!entity || typeof entity !== 'object') return null;
    const id = normalizeId(entity.id);
    if (!id) return null;
    if (entity.id === id) return entity;
    return { ...entity, id };
  }

  function normalizeAdv(prop) {
    if (!prop || typeof prop !== 'object') return null;
    const id = normalizeId(prop.id);
    const ownerId = normalizeId(prop.ownerId);
    const tenantId = normalizeId(prop.tenantId);
    return {
      ...prop,
      id: id || prop.id,
      ownerId: ownerId || prop.ownerId,
      tenantId: tenantId || prop.tenantId
    };
  }

  function normalizeConversation(conv) {
    if (!conv || typeof conv !== 'object') return null;
    return {
      ...conv,
      id: normalizeId(conv.id) || conv.id,
      userId: normalizeId(conv.userId) || conv.userId,
      propertyId: normalizeId(conv.propertyId) || conv.propertyId
    };
  }

  function normalizeTransaction(tx) {
    if (!tx || typeof tx !== 'object') return null;
    return {
      ...tx,
      id: normalizeId(tx.id) || tx.id,
      userId: normalizeId(tx.userId) || tx.userId,
      propertyId: normalizeId(tx.propertyId) || tx.propertyId
    };
  }

  async function fetchAdvertisement(options = {}) {
    const {
      page,
      limit,
      filters = {},
      withMeta = false,
      sort,
      order
    } = options || {};
    const params = { ...filters };
    if (page) params._page = page;
    if (limit) params._limit = limit;
    if (sort) params._sort = sort;
    if (order) params._order = order;
    try {
      const response = await api.get('/advertisement', { params });
      const data = response.data;
      const list = Array.isArray(data) ? data.map((p) => normalizeAdv(p) || p) : [];
      if (withMeta || page || limit) {
        const total = Number(response.headers['x-total-count']) || list.length;
        return { items: list, total };
      }
      return list;
    } catch (error) {
      handleApiError('Не удалось загрузить объявления. Убедитесь, что JSON-server запущен.', error);
      if (withMeta || page || limit) {
        return { items: [], total: 0 };
      }
      return [];
    }
  }

  async function getAdvertisementById(id) {
    const idStr = normalizeId(id);
    if (!idStr) return null;
    try {
      const { data } = await api.get(`/advertisement/${idStr}`);
      if (data) {
        return normalizeAdv(data) || data;
      }
      return data;
    } catch (error) {
      handleApiError('Не удалось загрузить объявление. Проверьте mock-server.', error);
      return null;
    }
  }

  async function getPropertyById(id) {
    return getAdvertisementById(id);
  }

  async function deleteAdvertisement(id) {
    const idStr = normalizeId(id);
    if (!idStr) return false;
    try {
      await api.delete(`/advertisement/${idStr}`);
      return true;
    } catch (error) {
      handleApiError('Не удалось удалить объявление. Проверьте JSON-server.', error);
      return false;
    }
  }

  async function queryUserByCredentials(email, password) {
    const params = { email, password };
    try {
      const { data } = await api.get('/users', { params });
      const user = Array.isArray(data) ? data[0] || null : null;
      return user ? withStringId(user) || user : null;
    } catch (error) {
      handleApiError('Ошибка входа. Проверьте подключение к JSON-server.', error);
      return null;
    }
  }

  async function findUserByEmail(email) {
    try {
      const { data } = await api.get('/users', { params: { email } });
      const user = Array.isArray(data) ? data[0] || null : null;
      return user ? withStringId(user) || user : null;
    } catch (error) {
      handleApiError('Не удалось проверить наличие пользователя.', error);
      return null;
    }
  }

  async function createUser(payload) {
    try {
      const { data } = await api.post('/users', payload);
      return withStringId(data) || data;
    } catch (error) {
      handleApiError('Не удалось создать пользователя. Проверьте JSON-server.', error);
      return null;
    }
  }

  async function updateUser(id, payload) {
    const idStr = normalizeId(id);
    if (!idStr) return null;
    try {
      const { data } = await api.patch(`/users/${idStr}`, payload);
      return withStringId(data) || data;
    } catch (error) {
      handleApiError('Не удалось обновить профиль. Проверьте JSON-server.', error);
      return null;
    }
  }

  async function getUserById(id) {
    const idStr = normalizeId(id);
    if (!idStr) return null;
    try {
      const { data } = await api.get(`/users/${idStr}`);
      return withStringId(data) || data;
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const { data: fallback } = await api.get('/users', { params: { id: idStr } });
          if (Array.isArray(fallback) && fallback.length) {
            return withStringId(fallback[0]) || fallback[0];
          }
          notifyError(`Пользователь с ID ${idStr} не найден на сервере. Пожалуйста, войдите заново.`);
        } catch (fallbackErr) {
          handleApiError('Fallback-запрос пользователя не удался. Проверьте JSON-server.', fallbackErr);
        }
      } else {
        handleApiError('Не удалось получить пользователя. Проверьте JSON-server.', error);
      }
      return null;
    }
  }

  async function fetchConversations(userId, forceRefresh = false) {
    const idStr = normalizeId(userId);
    if (!idStr) return [];
    if (!forceRefresh && conversationsCache.has(idStr)) {
      return conversationsCache.get(idStr);
    }
    try {
      const { data } = await api.get('/conversations', { params: { userId: idStr } });
      const list = Array.isArray(data) ? data : [];
      const normalized = list.map((c) => normalizeConversation(c) || c);
      conversationsCache.set(idStr, normalized);
      return normalized;
    } catch (error) {
      handleApiError('Не удалось загрузить список сообщений.', error);
      return [];
    }
  }

  async function fetchTransactions(userId, forceRefresh = false) {
    const idStr = normalizeId(userId);
    if (!idStr) return [];
    if (!forceRefresh && transactionsCache.has(idStr)) {
      return transactionsCache.get(idStr);
    }
    try {
      const { data } = await api.get('/transactions', { params: { userId: idStr } });
      const list = Array.isArray(data) ? data : [];
      const normalized = list.map((t) => normalizeTransaction(t) || t);
      transactionsCache.set(idStr, normalized);
      return normalized;
    } catch (error) {
      handleApiError('Не удалось загрузить историю платежей.', error);
      return [];
    }
  }

  function statusText(s) {
    if (!s) return '';
    if (s === 'available') return 'Доступно';
    if (s === 'rented') return 'Арендовано';
    return s;
  }

  FastRent.dataService = {
    normalizeId,
    withStringId,
    fetchAdvertisement,
    getAdvertisementById,
    getPropertyById,
    deleteAdvertisement,
    queryUserByCredentials,
    findUserByEmail,
    createUser,
    updateUser,
    getUserById,
    fetchConversations,
    fetchTransactions,
    statusText
  };
})(window);
