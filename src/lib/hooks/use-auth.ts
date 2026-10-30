import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '../api/token';
import type { User } from '../api/types';
import { asyncStoragePersister } from '../query/persister';
import { queryKeys } from '../query/query-keys';
import {
  authService,
  type LoginInput,
  type RegisterInput,
} from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => (await authService.me()).user,
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: async ({ token, user }) => {
      await tokenStorage.set(token);
      useAuthStore.getState().setSession(user);
      qc.setQueryData<User>(queryKeys.auth.me, user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: async ({ token, user }) => {
      await tokenStorage.set(token);
      qc.setQueryData<User>(queryKeys.auth.me, user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await tokenStorage.clear();
    qc.clear();
    await asyncStoragePersister.removeClient();
  };
}
