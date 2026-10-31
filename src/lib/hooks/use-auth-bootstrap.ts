import { useEffect } from 'react';
import { tokenStorage } from '../api/token';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

export function useAuthBootstrap() {
  const { isHydrating, setHydrating, setSession, clearSession } =
    useAuthStore();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await tokenStorage.get();
        if (!token) {
          if (!cancelled) clearSession();
          return;
        }
        const { user } = await authService.me();
        if (!cancelled) setSession(user);
      } catch {
        await tokenStorage.clear();
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isHydrating };
}
