import { apiRequest } from '../api/client';
import type { WorkoutPlan } from '../api/types';

export interface PlanExerciseInput {
  exerciseId: string;
  position: number;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
}

export interface CreatePlanInput {
  name: string;
  description?: string;
  exercises: PlanExerciseInput[];
}

export interface UpdatePlanInput {
  name?: string;
  description?: string | null;
  exercises?: PlanExerciseInput[];
}

export const workoutPlansService = {
  list: () => apiRequest<{ plans: WorkoutPlan[] }>('/workout-plans'),
  detail: (id: string) =>
    apiRequest<{ plan: WorkoutPlan }>(`/workout-plans/${id}`),
  create: (input: CreatePlanInput) =>
    apiRequest<{ plan: WorkoutPlan }>('/workout-plans', {
      method: 'POST',
      body: input,
    }),
  update: (id: string, input: UpdatePlanInput) =>
    apiRequest<{ plan: WorkoutPlan }>(`/workout-plans/${id}`, {
      method: 'PATCH',
      body: input,
    }),
  remove: (id: string) =>
    apiRequest<void>(`/workout-plans/${id}`, { method: 'DELETE' }),
};
