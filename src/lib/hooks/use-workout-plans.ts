import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query/query-keys';
import {
  workoutPlansService,
  type CreatePlanInput,
  type UpdatePlanInput,
} from '../services/workout-plans.service';

export function useWorkoutPlans() {
  return useQuery({
    queryKey: queryKeys.workoutPlans.list(),
    queryFn: () => workoutPlansService.list().then((r) => r.plans),
  });
}

export function useWorkoutPlan(id: string) {
  return useQuery({
    queryKey: queryKeys.workoutPlans.detail(id),
    queryFn: () => workoutPlansService.detail(id).then((r) => r.plan),
    enabled: !!id,
  });
}

export function useCreateWorkoutPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlanInput) => workoutPlansService.create(input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.workoutPlans.all }),
  });
}

export function useUpdateWorkoutPlan(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePlanInput) =>
      workoutPlansService.update(id, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.workoutPlans.all }),
  });
}

export function useDeleteWorkoutPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutPlansService.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.workoutPlans.all }),
  });
}
