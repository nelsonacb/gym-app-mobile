export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    preferences: ['users', 'me', 'preferences'] as const,
  },
  exercises: {
    all: ['exercises'] as const,
    list: (filters: Record<string, unknown> = {}) =>
      ['exercises', 'list', filters] as const,
    detail: (id: string) => ['exercises', 'detail', id] as const,
  },
  workoutPlans: {
    all: ['workout-plans'] as const,
    list: () => ['workout-plans', 'list'] as const,
    detail: (id: string) => ['workout-plans', 'detail', id] as const,
  },
  workoutSessions: {
    all: ['workout-sessions'] as const,
    list: (filters: Record<string, unknown> = {}) =>
      ['workout-sessions', 'list', filters] as const,
    detail: (id: string) => ['workout-sessions', 'detail', id] as const,
  },
  progress: {
    overall: ['progress', 'overall'] as const,
    exercise: (exerciseId: string, range: Record<string, unknown> = {}) =>
      ['progress', 'exercise', exerciseId, range] as const,
  },
} as const;
