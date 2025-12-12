import { User } from '../models/User';

export interface IAuthService {
  register(email: string, password: string): Promise<User>;
  login(email: string, password: string): Promise<{ accessToken: string }>;
}

export const AUTH_SERVICE = Symbol('IAuthService');
