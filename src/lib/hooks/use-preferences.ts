import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserPreferences, WeightUnit } from '../api/types';
import { queryKeys } from '../query/query-keys';
import { usersService } from '../services/users.service';

export interface UpdatePreferencesInput {
  weeklyGoal?: number | null;
  weightUnit?: WeightUnit;
}

export function usePreferences() {
  return useQuery({
    queryKey: queryKeys.users.preferences,
    queryFn: () => usersService.getPreferences().then((r) => r.preferences),
    staleTime: 5 * 60_000,
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePreferencesInput) =>
      usersService.updatePreferences(input),
    onSuccess: (data) => {
      qc.setQueryData<UserPreferences>(
        queryKeys.users.preferences,
        data.preferences,
      );
    },
  });
}
