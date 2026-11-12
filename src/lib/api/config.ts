import Constants from 'expo-constants';

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:4000/api`;
}

export const API_CONFIG = {
  baseUrl: resolveBaseUrl(),
  timeoutMs: 15_000,
} as const;
