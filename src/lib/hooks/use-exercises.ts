import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query/query-keys';
import {
  exercisesService,
  type ExerciseFilters,
} from '../services/exercises.service';

export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: queryKeys.exercises.list(filters),
    queryFn: () => exercisesService.list(filters).then((r) => r.exercises),
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: queryKeys.exercises.detail(id),
    queryFn: () => exercisesService.detail(id).then((r) => r.exercise),
    enabled: !!id,
  });
}
