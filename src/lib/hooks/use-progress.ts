import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query/query-keys';
import {
  progressService,
  type ProgressRange,
} from '../services/progress.service';

export function useOverallProgress() {
  return useQuery({
    queryKey: queryKeys.progress.overall,
    queryFn: () => progressService.overall().then((r) => r.progress),
  });
}

export function useExerciseProgress(
  exerciseId: string,
  range: ProgressRange = {},
) {
  return useQuery({
    queryKey: queryKeys.progress.exercise(exerciseId, range),
    queryFn: () =>
      progressService.exercise(exerciseId, range).then((r) => r.progress),
    enabled: !!exerciseId,
  });
}
