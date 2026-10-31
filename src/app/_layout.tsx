import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
import { useAuthBootstrap } from '../lib/hooks/use-auth-bootstrap';
import { asyncStoragePersister } from '../lib/query/persister';
import { queryClient } from '../lib/query/query-client';
import { useAuthStore } from '../lib/stores/auth.store';

function RootLayoutNav() {
  const { isHydrating } = useAuthBootstrap();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isHydrating) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isHydrating, segments]);

  if (isHydrating) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator
          size='large'
          color='#2563EB'
        />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='(auth)' />
      <Stack.Screen name='routines/[id]' />
      <Stack.Screen name='session/[id]' />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <RootLayoutNav />
    </PersistQueryClientProvider>
  );
}
