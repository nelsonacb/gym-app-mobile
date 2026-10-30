import { apiRequest } from '../api/client';
import type { Equipment, Exercise, MuscleGroup } from '../api/types';

export interface ExerciseFilters {
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
  search?: string;
}

export const exercisesService = {
  list: (filters: ExerciseFilters = {}) =>
    apiRequest<{ exercises: Exercise[] }>('/exercises', { query: filters }),
  detail: (id: string) =>
    apiRequest<{ exercise: Exercise }>(`/exercises/${id}`),
};
