import { apiRequest } from '../api/client';
import type { User, UserPreferences, WeightUnit } from '../api/types';

export interface UpdateProfileInput {
  name?: string;
  weightUnit?: WeightUnit;
}

export interface UpdatePreferencesInput {
  weeklyGoal?: number | null;
  weightUnit?: WeightUnit;
}

export const usersService = {
  updateProfile: (input: UpdateProfileInput) =>
    apiRequest<{ user: User }>('/users/me', { method: 'PATCH', body: input }),

  getPreferences: () =>
    apiRequest<{ preferences: UserPreferences }>('/users/me/preferences'),

  updatePreferences: (input: UpdatePreferencesInput) =>
    apiRequest<{ preferences: UserPreferences }>('/users/me/preferences', {
      method: 'PUT',
      body: input,
    }),
};
