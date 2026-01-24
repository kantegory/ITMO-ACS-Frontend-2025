export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
