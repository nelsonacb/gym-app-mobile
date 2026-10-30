import { apiRequest } from '../api/client';
import type {
  Paginated,
  SessionStatus,
  SetStatus,
  WorkoutSession,
  WorkoutSessionSummary,
  WorkoutSet,
} from '../api/types';

export interface SessionFilters {
  status?: SessionStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface StartSessionInput {
  workoutPlanId: string;
  startedAt?: string;
}

export interface UpdateSetInput {
  weight: number | null;
  reps: number | null;
  status?: SetStatus;
}

export const workoutSessionsService = {
  list: (filters: SessionFilters = {}) =>
    apiRequest<Paginated<WorkoutSessionSummary>>('/workout-sessions', {
      query: filters,
    }),

  detail: (id: string) =>
    apiRequest<{ session: WorkoutSession }>(`/workout-sessions/${id}`),

  start: (input: StartSessionInput) =>
    apiRequest<{ session: WorkoutSession }>('/workout-sessions/start', {
      method: 'POST',
      body: input,
    }),

  updateSet: (
    sessionId: string,
    sessionExerciseId: string,
    setNumber: number,
    input: UpdateSetInput,
  ) =>
    apiRequest<{ set: WorkoutSet }>(
      `/workout-sessions/${sessionId}/exercises/${sessionExerciseId}/sets/${setNumber}`,
      { method: 'PATCH', body: input },
    ),

  complete: (id: string) =>
    apiRequest<{ session: WorkoutSession }>(
      `/workout-sessions/${id}/complete`,
      { method: 'POST' },
    ),

  cancel: (id: string) =>
    apiRequest<{ session: WorkoutSession }>(`/workout-sessions/${id}/cancel`, {
      method: 'POST',
    }),
};
