const API_BASE_URL = 'http://localhost:3000';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error: Unable to connect to server. Make sure JSON server is running on http://localhost:3000');
        throw new Error('Не удалось подключиться к серверу. Убедитесь, что JSON-сервер запущен на http://localhost:3000');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

const api = new ApiClient();

const authAPI = {
  async register(email, password) {
    const users = await api.get('/users');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = await api.post('/users', {
      email,
      password,
      username: email,
      phone: '',
    });

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await api.post('/sessions', {
      userId: newUser.id,
      token,
      createdAt: new Date().toISOString(),
    });

    api.setToken(token);
    return { user: newUser, token };
  },

  async login(email, password) {
    const users = await api.get('/users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await api.post('/sessions', {
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
    });

    api.setToken(token);
    return { user, token };
  },

  async logout() {
    const token = api.getToken();
    if (token) {
      try {
        const sessions = await api.get('/sessions');
        const session = sessions.find(s => s.token === token);
        if (session) {
          await api.delete(`/sessions/${session.id}`);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    api.removeToken();
  },

  async getCurrentUser() {
    const token = api.getToken();
    if (!token) {
      return null;
    }

    try {
      const sessions = await api.get('/sessions');
      const session = sessions.find(s => s.token === token);
      if (!session) {
        return null;
      }

      const user = await api.get(`/users/${session.userId}`);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};

const listingsAPI = {
  async getAll() {
    return api.get('/listings');
  },

  async getById(id) {
    return api.get(`/listings/${id}`);
  },

  async create(listing) {
    return api.post('/listings', listing);
  },

  async update(id, listing) {
    return api.put(`/listings/${id}`, listing);
  },

  async delete(id) {
    return api.delete(`/listings/${id}`);
  },
};

const bookingsAPI = {
  async getByUserId(userId) {
    const bookings = await api.get('/bookings');
    return bookings.filter(b => b.userId === userId);
  },

  async create(booking) {
    return api.post('/bookings', booking);
  },

  async delete(id) {
    return api.delete(`/bookings/${id}`);
  },
};

