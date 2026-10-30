import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'forgefit.auth.token';
let memoryToken: string | null = null;

export const tokenStorage = {
  async get(): Promise<string | null> {
    if (memoryToken !== null) return memoryToken;
    memoryToken = (await SecureStore.getItemAsync(TOKEN_KEY)) ?? null;
    return memoryToken;
  },
  async set(token: string): Promise<void> {
    memoryToken = token;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    memoryToken = null;
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
