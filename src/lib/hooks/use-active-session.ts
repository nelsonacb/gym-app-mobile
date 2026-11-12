import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/query/query-keys';
import { workoutSessionsService } from '../../lib/services/workout-sessions.service';

export function useActiveSession() {
  return useQuery({
    queryKey: queryKeys.workoutSessions.list({
      status: 'IN_PROGRESS',
      limit: 1,
    }),
    queryFn: async () => {
      const page = await workoutSessionsService.list({
        status: 'IN_PROGRESS',
        limit: 1,
        offset: 0,
      });
      return page.items[0] ?? null;
    },
    staleTime: 0,
    refetchOnMount: 'always',
    retry: 1,
  });
}
