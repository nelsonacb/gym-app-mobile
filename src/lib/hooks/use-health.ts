import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../api/client';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiRequest<HealthResponse>('/health', { auth: false }),
    refetchInterval: 30_000,
  });
}
