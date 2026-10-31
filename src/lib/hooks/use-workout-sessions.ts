import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query/query-keys';
import {
  workoutSessionsService,
  type SessionFilters,
  type StartSessionInput,
  type UpdateSetInput,
} from '../services/workout-sessions.service';

export function useWorkoutSessions(filters: SessionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.workoutSessions.list(filters),
    queryFn: () => workoutSessionsService.list(filters),
  });
}

export function useWorkoutSession(id: string) {
  return useQuery({
    queryKey: queryKeys.workoutSessions.detail(id),
    queryFn: () => workoutSessionsService.detail(id).then((r) => r.session),
    enabled: !!id,
  });
}

export function useStartWorkoutSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: StartSessionInput) =>
      workoutSessionsService.start(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workoutSessions.all });
    },
  });
}

export function useUpdateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      sessionExerciseId,
      setNumber,
      input,
    }: {
      sessionId: string;
      sessionExerciseId: string;
      setNumber: number;
      input: UpdateSetInput;
    }) =>
      workoutSessionsService.updateSet(
        sessionId,
        sessionExerciseId,
        setNumber,
        input,
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.workoutSessions.detail(variables.sessionId),
      });
    },
  });
}

export function useCompleteWorkoutSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutSessionsService.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workoutSessions.all });
      qc.invalidateQueries({ queryKey: queryKeys.progress.overall });
    },
  });
}

export function useCancelWorkoutSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutSessionsService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workoutSessions.all });
      qc.invalidateQueries({ queryKey: queryKeys.progress.overall });
    },
  });
}
