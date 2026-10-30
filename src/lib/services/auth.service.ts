import { apiRequest } from '../api/client';
import type { User, WeightUnit } from '../api/types';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  weightUnit?: WeightUnit;
}

export const authService = {
  login: (input: LoginInput) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
      auth: false,
    }),

  register: (input: RegisterInput) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
      auth: false,
    }),

  me: () => apiRequest<{ user: User }>('/auth/me'),
};
