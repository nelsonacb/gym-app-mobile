import { useWeeklyReminder } from '@/lib/hooks/use-weekly-reminder';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useCurrentUser, useLogout } from '../../lib/hooks/use-auth';
import { usePreferences } from '../../lib/hooks/use-preferences';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function ProfileScreen() {
  const router = useRouter();
  const me = useCurrentUser();
  const prefs = usePreferences();
  const progress = useOverallProgress();
  const logout = useLogout();
  const insets = useSafeAreaInsets();
  const { enabled, loading, error, scheduleReminder, cancelReminder } =
    useWeeklyReminder(prefs.data?.weeklyGoal ?? null);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      contentContainerClassName='p-4'
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
    >
      <Text className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
        Profile
      </Text>

      {/* --- Datos del usuario --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
          Personal details
        </Text>
        {me.isLoading ? (
          <ActivityIndicator />
        ) : me.data ? (
          <>
            <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
              {me.data.name}
            </Text>
            <Text className='mt-1 text-sm text-gray-900 dark:text-white'>
              {me.data.email}
            </Text>
            <Text className='mt-2 text-xs text-gray-900 dark:text-white'>
              Unit of weight: {me.data.weightUnit}
            </Text>
          </>
        ) : (
          <Text className='text-sm text-red-600'>Error loading user</Text>
        )}
      </View>

      {/* --- Preferencias --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
          Preferences
        </Text>
        <ThemeToggle />
        <View className='flex-row items-center justify-between py-3'>
          <View className='flex-1 pr-4'>
            <Text className='text-gray-700 dark:text-gray-300'>
              Weekly reminder
            </Text>
            <Text className='text-xs text-gray-400 dark:text-gray-500'>
              {Platform.OS === 'android' &&
              Constants.executionEnvironment ===
                ExecutionEnvironment.StoreClient
                ? 'Requires development build on Android'
                : 'We send you weekly reminders to help you reach your goal'}
            </Text>
          </View>
          <Switch
            value={enabled}
            disabled={loading}
            onValueChange={(value) => {
              if (value) scheduleReminder();
              else cancelReminder();
            }}
          />
        </View>

        {error ? (
          <Text className='mt-1 text-xs text-amber-600 dark:text-amber-400'>
            {error}
          </Text>
        ) : null}
        {prefs.isLoading ? (
          <ActivityIndicator />
        ) : prefs.data ? (
          <>
            <View className='flex-row items-center justify-between py-2'>
              <Text className='text-gray-700'>Weekly Goal</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {prefs.data.weeklyGoal ?? 'Undefined'}
                {prefs.data.weeklyGoal ? ' sessions' : ''}
              </Text>
            </View>
            <View className='flex-row items-center justify-between py-2'>
              <Text className='text-gray-700'>Unit of weight</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {prefs.data.weightUnit}
              </Text>
            </View>
          </>
        ) : (
          <Text className='text-sm text-red-600'>
            Error loading preferences
          </Text>
        )}
      </View>

      {/* --- Estadísticas --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-500'>
          Global statisticss
        </Text>
        {progress.isLoading ? (
          <ActivityIndicator />
        ) : progress.data ? (
          <>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Sessions completed</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {progress.data.totalSessions}
              </Text>
            </View>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Total volume</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {progress.data.totalVolume.toLocaleString()} kg
              </Text>
            </View>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Total time</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {Math.round(progress.data.totalDurationSeconds / 60)} min
              </Text>
            </View>
          </>
        ) : (
          <Text className='text-sm text-red-600'>Error loading statistics</Text>
        )}
      </View>

      {/* --- Logout --- */}
      <Pressable
        className='mt-2 items-center rounded-lg border border-red-200 bg-red-50 p-4 active:bg-red-100'
        onPress={handleLogout}
      >
        <Text className='font-semibold text-red-600'>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}
