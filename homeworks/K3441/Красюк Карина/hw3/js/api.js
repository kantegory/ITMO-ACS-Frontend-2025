const API_BASE_URL = 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Сервер вернул неожиданный формат: ${text.substring(0, 100)}`);
      }
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || `Ошибка: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Не удалось подключиться к серверу. Убедитесь, что json-server запущен на http://localhost:3000');
    }
    throw error;
  }
}

export const authAPI = {
  async login(email, password, role) {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    
    if (data.accessToken) {
      setToken(data.accessToken);
      setUser(data.user);
    }
    
    return data;
  },

  async register(userData) {
    const newUser = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        ...(userData.role === 'candidate' 
          ? { name: userData.name, position: userData.position, city: userData.city }
          : { companyName: userData.companyName, industry: userData.industry, city: userData.city }
        )
      }),
    });
    
    if (userData.role === 'candidate') {
      try {
        await apiRequest('/resumes', {
          method: 'POST',
          body: JSON.stringify({
            userId: newUser.id,
            position: userData.position || '',
            salary: 0,
            city: userData.city || '',
            employmentType: '',
            skills: [],
            experience: [],
            education: '',
            about: '',
            isVisible: true,
          }),
        });
      } catch (error) {
        console.error('Ошибка создания резюме:', error);
      }
    }
    
    return {
      success: true,
      user: newUser
    };
  },

  logout() {
    removeToken();
    removeUser();
  },

  getCurrentUser() {
    return getUser();
  },

  isAuthenticated() {
    return !!getToken();
  },
};

export const jobsAPI = {
  async getAll() {
    return apiRequest('/jobs');
  },

  async getById(id) {
    return apiRequest(`/jobs/${id}`);
  },

  async create(jobData) {
    const user = getUser();
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        ...jobData,
        employerId: user.id,
        status: 'active',
        publishedAt: new Date().toISOString().split('T')[0],
        applicationsCount: 0,
      }),
    });
  },

  async update(id, jobData) {
    return apiRequest(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(jobData),
    });
  },

  async delete(id) {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

export const resumesAPI = {
  async getByUserId(userId) {
    const resumes = await apiRequest('/resumes');
    return resumes.find(r => r.userId === userId);
  },

  async update(id, resumeData) {
    return apiRequest(`/resumes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(resumeData),
    });
  },

  async create(resumeData) {
    return apiRequest('/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    });
  },
};

export const applicationsAPI = {
  async getByUserId(userId) {
    const applications = await apiRequest('/applications');
    return applications.filter(a => a.userId === userId);
  },

  async getByJobId(jobId) {
    const applications = await apiRequest('/applications');
    return applications.filter(a => a.jobId === jobId);
  },

  async create(jobId) {
    const user = getUser();
    const application = await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        jobId,
        userId: user.id,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      }),
    });

    const job = await jobsAPI.getById(jobId);
    await jobsAPI.update(jobId, {
      applicationsCount: (job.applicationsCount || 0) + 1,
    });

    return application;
  },

  async update(id, status) {
    return apiRequest(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export { getToken, setToken, removeToken, getUser, setUser, removeUser };

