import { ShareableSummary } from '@/components/ShareableSummary';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeeklyVolumeChart } from '../../components/WeeklyVolumeChart';
import { ApiError } from '../../lib/api/errors';
import { useCurrentUser } from '../../lib/hooks/use-auth';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const me = useCurrentUser();
  const progress = useOverallProgress();

  const isUnauthenticated =
    (me.error instanceof ApiError && me.error.status === 401) ||
    (progress.error instanceof ApiError && progress.error.status === 401);

  const onRefresh = () => {
    me.refetch();
    progress.refetch();
  };

  const firstName = me.data?.name?.split(' ')[0];
  const hasWeeklyData = !!progress.data?.weeklyFrequency?.length;

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
