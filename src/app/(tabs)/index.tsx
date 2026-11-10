import { ShareableSummary } from '@/components/ShareableSummary';
import { WorkoutSession } from '@/lib/api/types';
import Ionicons from '@react-native-vector-icons/ionicons';
import { onlineManager } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeeklyVolumeChart } from '../../components/WeeklyVolumeChart';
import { ApiError } from '../../lib/api/errors';
import { activeSessionStore } from '../../lib/db/active-session';
import { useActiveSession } from '../../lib/hooks/use-active-session';
import { useCurrentUser } from '../../lib/hooks/use-auth';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const me = useCurrentUser();
  const progress = useOverallProgress();
  const activeSession = useActiveSession();
  const [localSession, setLocalSession] = useState<WorkoutSession | null>(null);
  const isOnline = onlineManager.isOnline();

  const isUnauthenticated =
    (me.error instanceof ApiError && me.error.status === 401) ||
    (progress.error instanceof ApiError && progress.error.status === 401);

  const onRefresh = () => {
    me.refetch();
    progress.refetch();
  };

  const firstName = me.data?.name?.split(' ')[0];
  const hasWeeklyData = !!progress.data?.weeklyFrequency?.length;

  useEffect(() => {
    if (activeSession.isError) {
      setLocalSession(activeSessionStore.get());
    }
  }, [activeSession.isError]);

  const sessionToShow = activeSession.data ?? localSession;

  return (
    <ScrollView
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      contentContainerClassName='p-4'
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={me.isRefetching || progress.isRefetching}
          onRefresh={onRefresh}
        />
      }
    >
      {sessionToShow ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/session/[id]',
              params: { id: sessionToShow.id },
            })
          }
          className='mb-4 flex-row items-center rounded-2xl bg-blue-600 p-4'
        >
          <Ionicons
            name='play-circle'
            size={24}
            color='#FFFFFF'
          />
          <View className='ml-3 flex-1'>
            <Text className='text-sm font-bold text-white'>
              {isOnline
                ? 'Training in progress'
                : 'Training in progress (offline)'}
            </Text>
            <Text className='text-xs text-blue-100'>
              Tap to continue where you left off
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View className='mb-4 bg-white dark:bg-gray-800 p-4'>
        <Text className='text-2xl font-bold text-gray-900 dark:text-white'>
          {firstName ? `Hello, ${firstName}` : 'Dashboard'}
        </Text>
        <Text className='text-sm text-gray-900 dark:text-white'>
          {isUnauthenticated
            ? 'Log in to see your progress'
            : 'Your training summary'}
        </Text>
      </View>

      {hasWeeklyData ? (
        <WeeklyVolumeChart weeklyVolume={progress.data!.weeklyVolume} />
      ) : null}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-1 text-sm text-gray-900 dark:text-white'>User</Text>
        {me.isLoading ? (
          <ActivityIndicator />
        ) : me.data ? (
          <>
            <Text className='text-base font-semibold text-gray-500 dark:text-gray-400'>
              {me.data.name}
            </Text>
            <Text className='text-sm text-gray-500 dark:text-gray-400'>
              {me.data.email}
            </Text>
          </>
        ) : isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            You are not logged in. Go to the login screen.
          </Text>
        ) : (
          <Text className='text-sm text-red-600'>Error loading user</Text>
        )}
      </View>
      <View className='mb-4 rounded-2xl bg-white p-4 dark:bg-gray-800'>
        <Text className='mb-2 text-sm text-gray-900 dark:text-white'>
          Overall progress
        </Text>
        {isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            Log in to see your progress.
          </Text>
        ) : progress.isLoading ? (
          <ActivityIndicator />
        ) : progress.data && me.data ? (
          <>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Sessions completed: {progress.data.totalSessions}
            </Text>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Total volume: {progress.data.totalVolume} kg
            </Text>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Total duration:{' '}
              {Math.round(progress.data.totalDurationSeconds / 60)} min
            </Text>
            <ShareableSummary
              userName={me.data.name}
              weeklyVolume={progress.data.weeklyVolume}
              totalSessions={progress.data.totalSessions}
              totalVolume={progress.data.totalVolume}
            />
          </>
        ) : (
          <Text className='text-sm text-red-600'>
            Progress could not be loaded
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
