import { registerMutationDefaults } from '@/lib/query/mutation-defaults';
import { setupNetworkManager } from '@/lib/query/network';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
import { initDatabase } from '../lib/db/database';
import { useAuthBootstrap } from '../lib/hooks/use-auth-bootstrap';
import { persistOptions } from '../lib/query/persister';
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
      <Stack.Screen name='exercise/[id]' />
      <Stack.Screen
        name='plan-form'
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    try {
      initDatabase();
      setupNetworkManager();
      registerMutationDefaults(queryClient);
    } catch (err) {
      console.error('[db] init failed', err);
    }
  }, []);
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['progress'] });
        });
      }}
    >
      <RootLayoutNav />
    </PersistQueryClientProvider>
  );
}
