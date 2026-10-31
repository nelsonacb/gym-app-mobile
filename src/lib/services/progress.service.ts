import { apiRequest } from '../api/client';

export interface OverallProgress {
  totalSessions: number;
  totalVolume: number;
  totalDurationSeconds: number;
  weeklyFrequency: Array<{ weekStart: string; count: number }>;
  weeklyVolume: Array<{ weekStart: string; volume: number }>;
}

export interface ExerciseProgress {
  exerciseId: string;
  totalSets: number;
  personalRecords: {
    maxWeight: number | null;
    maxSingleSetVolume: number | null;
  };
  history: Array<{
    sessionId: string;
    startedAt: string;
    weight: number;
    reps: number;
    volume: number;
  }>;
}

export interface ProgressRange {
  from?: string;
  to?: string;
}

export const progressService = {
  overall: () => apiRequest<{ progress: OverallProgress }>('/progress/overall'),
  exercise: (exerciseId: string, range: ProgressRange = {}) =>
    apiRequest<{ progress: ExerciseProgress }>(
      `/progress/exercises/${exerciseId}`,
      { query: range },
    ),
};
