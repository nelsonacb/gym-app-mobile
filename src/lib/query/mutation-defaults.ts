import type { QueryClient } from '@tanstack/react-query';
import type { UpdateSetInput } from '../../lib/services/workout-sessions.service';
import { workoutSessionsService } from '../../lib/services/workout-sessions.service';

export function registerMutationDefaults(qc: QueryClient) {
  qc.setMutationDefaults(['sets', 'update'], {
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
  });

  qc.setMutationDefaults(['sessions', 'complete'], {
    mutationFn: ({ sessionId }: { sessionId: string }) =>
      workoutSessionsService.complete(sessionId),
  });

  qc.setMutationDefaults(['sessions', 'cancel'], {
    mutationFn: ({ sessionId }: { sessionId: string }) =>
      workoutSessionsService.cancel(sessionId),
  });
}
